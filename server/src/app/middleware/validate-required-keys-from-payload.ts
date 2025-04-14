import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/bad-request-error";

export default function validateRequiredKeysFromPayload(keys: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const missingKeys: string[] = keys.filter(key => !req.body.hasOwnProperty(key));
    if (missingKeys.length > 0) {
      const missingKeysString = missingKeys.join(', ');
      throw new BadRequestError(`Request missing values for: ${missingKeysString}`)
    }

    next();
  }
}