export type AppErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "PRODUCT_NOT_FOUND"
  | "INSUFFICIENT_STOCK"
  | "INVALID_COMBO"
  | "INVALID_DISCOUNT"
  | "SHIPPING_UNAVAILABLE"
  | "ORDER_CREATION_FAILED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    code: AppErrorCode,
    message: string,
    statusCode = 500,
    details?: unknown,
  ) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}