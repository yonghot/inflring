import { SupabaseClient } from '@supabase/supabase-js';
import { Contract, ContractStatus } from '@/lib/types';
import { ContractCreateInput } from '@/lib/validations';
import {
  getContractById as getContractByIdRepo,
  getContractByMatchId,
  getContractsByUserId,
  createContract as createContractRepo,
  updateContract,
} from '@/lib/repositories/contract-repository';
import {
  createEscrow,
  getEscrowByContractId,
  updateEscrow,
} from '@/lib/repositories/escrow-repository';
import { getMatchById } from '@/lib/repositories/match-repository';
import {
  AuthorizationError,
  ValidationError,
} from '@/lib/utils/api-helpers';

function isContractParty(contract: Contract, userId: string): boolean {
  return contract.creator_id === userId || contract.brand_id === userId;
}

export async function createContract(
  supabase: SupabaseClient,
  userId: string,
  data: ContractCreateInput
): Promise<Contract> {
  const match = await getMatchById(supabase, data.matchId);

  if (!match) {
    throw new ValidationError('매칭을 찾을 수 없습니다');
  }

  const brandProfileId = match.campaign?.brand?.profile_id;

  if (userId !== brandProfileId) {
    throw new AuthorizationError('브랜드 당사자만 계약을 생성할 수 있습니다');
  }

  const existingContract = await getContractByMatchId(supabase, data.matchId);

  if (existingContract) {
    throw new ValidationError('해당 매칭에 이미 계약이 존재합니다');
  }

  const creatorProfileId = match.creator?.profile_id;

  if (!creatorProfileId || !brandProfileId) {
    throw new ValidationError('매칭 정보가 불완전합니다');
  }

  const platformFee = Math.floor(data.amount * 0.1);

  return createContractRepo(supabase, {
    match_id: data.matchId,
    creator_id: creatorProfileId,
    brand_id: brandProfileId,
    amount: data.amount,
    platform_fee: platformFee,
    content_requirements: data.contentRequirements,
    delivery_deadline: data.deliveryDeadline,
    max_revisions: data.maxRevisions,
    status: 'pending_sign' as ContractStatus,
  });
}

export async function getMyContracts(
  supabase: SupabaseClient,
  userId: string
): Promise<Contract[]> {
  return getContractsByUserId(supabase, userId);
}

export async function getContractById(
  supabase: SupabaseClient,
  userId: string,
  contractId: string
): Promise<Contract> {
  const contract = await getContractByIdRepo(supabase, contractId);

  if (!contract) {
    throw new ValidationError('계약을 찾을 수 없습니다');
  }

  if (!isContractParty(contract, userId)) {
    throw new AuthorizationError('계약 당사자만 조회할 수 있습니다');
  }

  return contract;
}

export async function signContract(
  supabase: SupabaseClient,
  userId: string,
  contractId: string
): Promise<Contract> {
  const contract = await getContractByIdRepo(supabase, contractId);

  if (!contract) {
    throw new ValidationError('계약을 찾을 수 없습니다');
  }

  if (!isContractParty(contract, userId)) {
    throw new AuthorizationError('계약 당사자만 서명할 수 있습니다');
  }

  if (contract.status !== 'pending_sign') {
    throw new ValidationError('서명 대기 상태의 계약만 서명할 수 있습니다');
  }

  const isCreator = contract.creator_id === userId;
  const isBrand = contract.brand_id === userId;

  if (isCreator && contract.signed_by_creator) {
    throw new ValidationError('이미 서명한 계약입니다');
  }

  if (isBrand && contract.signed_by_brand) {
    throw new ValidationError('이미 서명한 계약입니다');
  }

  const updateData: Partial<Contract> = {};

  if (isCreator) {
    updateData.signed_by_creator = true;
  }
  if (isBrand) {
    updateData.signed_by_brand = true;
  }

  const willBothSign =
    (isCreator && contract.signed_by_brand) ||
    (isBrand && contract.signed_by_creator);

  if (willBothSign) {
    updateData.status = 'active' as ContractStatus;
    updateData.signed_at = new Date().toISOString();
  }

  const updated = await updateContract(supabase, contractId, updateData);

  if (willBothSign) {
    await createEscrow(supabase, {
      contract_id: contractId,
      amount: contract.amount,
      platform_fee: contract.platform_fee,
      status: 'pending',
    });
  }

  return updated;
}

const VALID_STATUS_TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  draft: ['pending_sign', 'cancelled'],
  pending_sign: ['active', 'cancelled'],
  active: ['content_submitted', 'cancelled', 'disputed'],
  content_submitted: ['under_review', 'revision_requested', 'approved'],
  under_review: ['revision_requested', 'approved'],
  revision_requested: ['content_submitted', 'cancelled', 'disputed'],
  approved: ['completed'],
  completed: [],
  disputed: ['cancelled', 'completed'],
  cancelled: [],
};

export async function updateStatus(
  supabase: SupabaseClient,
  userId: string,
  contractId: string,
  status: ContractStatus
): Promise<Contract> {
  const contract = await getContractByIdRepo(supabase, contractId);

  if (!contract) {
    throw new ValidationError('계약을 찾을 수 없습니다');
  }

  if (!isContractParty(contract, userId)) {
    throw new AuthorizationError('계약 당사자만 상태를 변경할 수 있습니다');
  }

  const allowed = VALID_STATUS_TRANSITIONS[contract.status] ?? [];

  if (!allowed.includes(status)) {
    throw new ValidationError(
      `'${contract.status}' 상태에서 '${status}' 상태로 변경할 수 없습니다`
    );
  }

  return updateContract(supabase, contractId, { status });
}

export async function submitContent(
  supabase: SupabaseClient,
  creatorId: string,
  contractId: string
): Promise<Contract> {
  const contract = await getContractByIdRepo(supabase, contractId);

  if (!contract) {
    throw new ValidationError('계약을 찾을 수 없습니다');
  }

  if (contract.creator_id !== creatorId) {
    throw new AuthorizationError('크리에이터만 콘텐츠를 제출할 수 있습니다');
  }

  if (contract.status !== 'active' && contract.status !== 'revision_requested') {
    throw new ValidationError('콘텐츠를 제출할 수 있는 상태가 아닙니다');
  }

  return updateContract(supabase, contractId, {
    status: 'content_submitted' as ContractStatus,
  });
}

export async function requestRevision(
  supabase: SupabaseClient,
  brandId: string,
  contractId: string
): Promise<Contract> {
  const contract = await getContractByIdRepo(supabase, contractId);

  if (!contract) {
    throw new ValidationError('계약을 찾을 수 없습니다');
  }

  if (contract.brand_id !== brandId) {
    throw new AuthorizationError('브랜드만 수정을 요청할 수 있습니다');
  }

  if (contract.status !== 'content_submitted' && contract.status !== 'under_review') {
    throw new ValidationError('수정 요청을 할 수 있는 상태가 아닙니다');
  }

  if (contract.revision_count >= contract.max_revisions) {
    throw new ValidationError(
      `최대 수정 횟수(${contract.max_revisions}회)를 초과했습니다`
    );
  }

  return updateContract(supabase, contractId, {
    status: 'revision_requested' as ContractStatus,
    revision_count: contract.revision_count + 1,
  });
}

export async function completeContract(
  supabase: SupabaseClient,
  brandId: string,
  contractId: string
): Promise<Contract> {
  const contract = await getContractByIdRepo(supabase, contractId);

  if (!contract) {
    throw new ValidationError('계약을 찾을 수 없습니다');
  }

  if (contract.brand_id !== brandId) {
    throw new AuthorizationError('브랜드만 계약을 완료할 수 있습니다');
  }

  if (
    contract.status !== 'content_submitted' &&
    contract.status !== 'under_review' &&
    contract.status !== 'approved'
  ) {
    throw new ValidationError('완료할 수 있는 상태가 아닙니다');
  }

  const escrow = await getEscrowByContractId(supabase, contractId);

  if (escrow) {
    await updateEscrow(supabase, escrow.id, {
      status: 'released',
      released_at: new Date().toISOString(),
    });
  }

  return updateContract(supabase, contractId, {
    status: 'completed' as ContractStatus,
    completed_at: new Date().toISOString(),
  });
}
