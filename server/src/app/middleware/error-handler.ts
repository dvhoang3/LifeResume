import { NextFunction, Request, Response } from "express";
import { APP_DEBUG } from "../../config/config";
import CustomError from "../errors/custom-error";

function getErrorMessage(err: any) {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) return String(err.message);
  if (typeof err === "string") return err;
  return "An internal error has occurred.";
}

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent || APP_DEBUG) {
    next(err);
    return;
  }

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
      },
    });

    return;
  }

  if (err.code && err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    const duplicateValue = err.keyValue[duplicateField];

    res.status(409).json({
      error: {
        message: `Duplicate key error: '${duplicateField}' with value '${duplicateValue}' already exists.`,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message: getErrorMessage(err) || "An internal error has occurred.",
    },
  });
}