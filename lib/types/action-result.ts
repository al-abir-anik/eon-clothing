export type ActionSuccess<T> = {
  success: true;
  data: T;
};

export type ActionFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;