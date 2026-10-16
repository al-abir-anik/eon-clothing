import { ZodError } from "zod";

import { AppError } from "./app-error";

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false as const,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  if (error instanceof ZodError) {
    return {
      success: false as const,
      error: {
        code: "VALIDATION_ERROR" as const,
        message: "Please check the submitted information.",
        details: error.flatten(),
      },
    };
  }

  console.error("Unhandled application error:", error);

  return {
    success: false as const,
    error: {
      code: "INTERNAL_ERROR" as const,
      message: "Something went wrong. Please try again.",
    },
  };
}