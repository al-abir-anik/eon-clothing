import { ZodError, type ZodType } from "zod";

import { AppError } from "@/lib/errors";
import type { ActionResult } from "@/lib/types/action-result";

export async function executeServerAction<TInput, TOutput>(
  input: TInput,
  schema: ZodType<TInput>,
  action: (validatedInput: TInput) => Promise<TOutput>,
): Promise<ActionResult<TOutput>> {
  try {
    const validatedInput = schema.parse(input);

    const data = await action(validatedInput);

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Please check the submitted information.",
          details: error.flatten(),
        },
      };
    }

    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      };
    }

    console.error("Unhandled server action error:", error);

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      },
    };
  }
}