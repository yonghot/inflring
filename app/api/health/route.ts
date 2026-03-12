import { successResponse } from '@/lib/utils/api-helpers';

export async function GET() {
  return successResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
