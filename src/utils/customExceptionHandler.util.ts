class HttpError {
  constructor(public status: number, public message: string, public error: string) {
    return {
        status: this.status,
        message: this.message,
        error: this.error,
    }
  }

  static badRequest(entity: string, error: string) {
    return new HttpError(400, `BAD_REQUEST: ${entity}`, error);
  }

  static notFound(entity: string, error: string) {
    return new HttpError(404, `NOT_FOUND: ${entity}`, error);
  }

  static internalServerError(entity: string, error: string) {
    return new HttpError(500, `INTERNAL_SERVER_ERROR: ${entity}`, error);
  }

  static unauthorized(entity: string, error: string) {
    return new HttpError(401, `UNAUTHORIZED: ${entity}`, error);
  }

  static forbidden(entity: string, error: string) {
    return new HttpError(403, `FORBIDDEN: ${entity}`, error);
  }

  static conflict(entity: string, error: string) {
    return new HttpError(409, `CONFLICT: ${entity}`, error);
  }
}

export { HttpError };
