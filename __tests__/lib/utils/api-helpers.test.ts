import { describe, it, expect } from 'vitest';
import {
  successResponse,
  errorResponse,
  handleServiceError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from '@/lib/utils/api-helpers';

// ---------------------------------------------------------------------------
// successResponse()
// ---------------------------------------------------------------------------
describe('successResponse', () => {
  it('returns a response with success: true and data', async () => {
    const data = { id: '1', name: 'Test' };
    const response = successResponse(data);
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toEqual(data);
  });

  it('defaults to status 200', () => {
    const response = successResponse({ ok: true });
    expect(response.status).toBe(200);
  });

  it('accepts a custom status code', () => {
    const response = successResponse({ created: true }, undefined, 201);
    expect(response.status).toBe(201);
  });

  it('includes meta when provided', async () => {
    const meta = { total: 100, page: 1, limit: 10 };
    const response = successResponse([1, 2, 3], meta);
    const body = await response.json();

    expect(body.meta).toEqual(meta);
  });

  it('omits meta when not provided', async () => {
    const response = successResponse('data');
    const body = await response.json();

    expect(body.meta).toBeUndefined();
  });

  it('handles null data', async () => {
    const response = successResponse(null);
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toBeNull();
  });

  it('handles array data', async () => {
    const data = [{ id: 1 }, { id: 2 }];
    const response = successResponse(data);
    const body = await response.json();

    expect(body.data).toHaveLength(2);
    expect(body.data[0].id).toBe(1);
  });

  it('handles empty object data', async () => {
    const response = successResponse({});
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.data).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// errorResponse()
// ---------------------------------------------------------------------------
describe('errorResponse', () => {
  it('returns a response with success: false and error message', async () => {
    const response = errorResponse('Something went wrong', 500);
    const body = await response.json();

    expect(body.success).toBe(false);
    expect(body.error).toBe('Something went wrong');
  });

  it('uses the provided status code', () => {
    const response = errorResponse('Not found', 404);
    expect(response.status).toBe(404);
  });

  it('handles 400 Bad Request', async () => {
    const response = errorResponse('Invalid input', 400);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Invalid input');
  });

  it('handles 401 Unauthorized', () => {
    const response = errorResponse('Unauthorized', 401);
    expect(response.status).toBe(401);
  });

  it('handles 403 Forbidden', () => {
    const response = errorResponse('Forbidden', 403);
    expect(response.status).toBe(403);
  });

  it('handles Korean error messages', async () => {
    const response = errorResponse('인증이 필요합니다', 401);
    const body = await response.json();

    expect(body.error).toBe('인증이 필요합니다');
  });

  it('does not include data field', async () => {
    const response = errorResponse('error', 500);
    const body = await response.json();

    expect(body.data).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Custom Error Classes
// ---------------------------------------------------------------------------
describe('AuthenticationError', () => {
  it('creates an error with name "AuthenticationError"', () => {
    const err = new AuthenticationError('bad creds');
    expect(err.name).toBe('AuthenticationError');
    expect(err.message).toBe('bad creds');
  });

  it('is an instance of Error', () => {
    const err = new AuthenticationError('test');
    expect(err).toBeInstanceOf(Error);
  });

  it('is an instance of AuthenticationError', () => {
    const err = new AuthenticationError('test');
    expect(err).toBeInstanceOf(AuthenticationError);
  });
});

describe('AuthorizationError', () => {
  it('creates an error with name "AuthorizationError"', () => {
    const err = new AuthorizationError('no access');
    expect(err.name).toBe('AuthorizationError');
    expect(err.message).toBe('no access');
  });

  it('is an instance of Error', () => {
    const err = new AuthorizationError('test');
    expect(err).toBeInstanceOf(Error);
  });

  it('is an instance of AuthorizationError', () => {
    const err = new AuthorizationError('test');
    expect(err).toBeInstanceOf(AuthorizationError);
  });
});

describe('ValidationError', () => {
  it('creates an error with name "ValidationError"', () => {
    const err = new ValidationError('bad data');
    expect(err.name).toBe('ValidationError');
    expect(err.message).toBe('bad data');
  });

  it('is an instance of Error', () => {
    const err = new ValidationError('test');
    expect(err).toBeInstanceOf(Error);
  });

  it('is an instance of ValidationError', () => {
    const err = new ValidationError('test');
    expect(err).toBeInstanceOf(ValidationError);
  });
});

// ---------------------------------------------------------------------------
// handleServiceError()
// ---------------------------------------------------------------------------
describe('handleServiceError', () => {
  it('returns 401 for AuthenticationError', async () => {
    const error = new AuthenticationError('인증이 필요합니다');
    const response = handleServiceError(error);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toBe('인증이 필요합니다');
  });

  it('returns 403 for AuthorizationError', async () => {
    const error = new AuthorizationError('권한이 없습니다');
    const response = handleServiceError(error);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error).toBe('권한이 없습니다');
  });

  it('returns 400 for ValidationError', async () => {
    const error = new ValidationError('유효하지 않은 데이터');
    const response = handleServiceError(error);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe('유효하지 않은 데이터');
  });

  it('returns 500 for generic Error with its message', async () => {
    const error = new Error('Database connection failed');
    const response = handleServiceError(error);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Database connection failed');
  });

  it('returns 500 with default message for non-Error objects', async () => {
    const response = handleServiceError('string error');
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('서버 내부 오류가 발생했습니다');
  });

  it('returns 500 with default message for null', async () => {
    const response = handleServiceError(null);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('서버 내부 오류가 발생했습니다');
  });

  it('returns 500 with default message for undefined', async () => {
    const response = handleServiceError(undefined);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('서버 내부 오류가 발생했습니다');
  });

  it('returns 500 with default message for number', async () => {
    const response = handleServiceError(42);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('서버 내부 오류가 발생했습니다');
  });

  it('preserves the custom message in AuthenticationError', async () => {
    const error = new AuthenticationError('프로필을 찾을 수 없습니다');
    const response = handleServiceError(error);
    const body = await response.json();

    expect(body.error).toBe('프로필을 찾을 수 없습니다');
  });

  it('correctly differentiates error types in priority order', async () => {
    // AuthenticationError takes precedence in the if-chain
    const authN = handleServiceError(new AuthenticationError('msg'));
    expect(authN.status).toBe(401);

    const authZ = handleServiceError(new AuthorizationError('msg'));
    expect(authZ.status).toBe(403);

    const val = handleServiceError(new ValidationError('msg'));
    expect(val.status).toBe(400);

    const generic = handleServiceError(new Error('msg'));
    expect(generic.status).toBe(500);
  });
});
