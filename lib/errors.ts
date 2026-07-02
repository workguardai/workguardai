/**
 * Typed application errors.
 *
 * Responsibility: Represent expected failure modes as typed errors carrying a
 * stable machine `code`, an HTTP `status`, and a client-safe `message`. This
 * lets the centralized error->response mapper produce consistent envelopes
 * without leaking stack traces or internal details.
 *
 * Extension point: add a subclass for a new failure mode; the mapper in
 * `lib/http/response.ts` handles any `AppError` generically.
 */

/** Stable, machine-readable error codes returned to clients. */
export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  LIMIT_EXCEEDED: 'LIMIT_EXCEEDED',
  RATE_LIMITED: 'RATE_LIMITED',
  AI_ERROR: 'AI_ERROR',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Base class for all expected, client-facing errors. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: ErrorCode, status: number, message: string, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Request validation failed', details?: unknown) {
    super(ErrorCode.VALIDATION_ERROR, 400, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(ErrorCode.UNAUTHORIZED, 401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(ErrorCode.FORBIDDEN, 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(ErrorCode.NOT_FOUND, 404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(ErrorCode.CONFLICT, 409, message);
  }
}

/** Raised when a subscription-tier usage limit would be exceeded. */
export class LimitExceededError extends AppError {
  constructor(message: string, details?: unknown) {
    super(ErrorCode.LIMIT_EXCEEDED, 402, message, details);
  }
}

export class UploadError extends AppError {
  constructor(message = 'File upload failed', details?: unknown) {
    super(ErrorCode.UPLOAD_ERROR, 400, message, details);
  }
}

/** Raised by the AI layer when Gemini fails or returns invalid/unparseable output. */
export class AIError extends AppError {
  constructor(message = 'AI processing failed', details?: unknown) {
    super(ErrorCode.AI_ERROR, 502, message, details);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
