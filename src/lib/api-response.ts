import { NextResponse } from "next/server";

export interface ApiResponseOptions {
  status?: number;
}

export function successResponse(data: any, meta: any = {}, options: ApiResponseOptions = {}) {
  const { status = 200 } = options;
  return NextResponse.json(
    {
      data,
      meta,
    },
    { status }
  );
}

export function errorResponse(
  code: string,
  message: string,
  details: any = null,
  status: number = 400
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

export const API_ERRORS = {
  UNAUTHORIZED: { code: "UNAUTHORIZED", message: "Invalid or missing API key", status: 401 },
  FORBIDDEN: { code: "FORBIDDEN", message: "You do not have access to this resource", status: 403 },
  NOT_FOUND: { code: "NOT_FOUND", message: "Resource not found", status: 404 },
  RATE_LIMITED: { code: "RATE_LIMITED", message: "Creating too many requests", status: 429 },
  INTERNAL_ERROR: { code: "INTERNAL_ERROR", message: "An internal error occurred", status: 500 },
  VALIDATION_ERROR: { code: "VALIDATION_ERROR", message: "Invalid request data", status: 400 },
};
