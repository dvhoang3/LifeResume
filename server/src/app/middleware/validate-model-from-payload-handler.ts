import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/bad-request-error";
import mongoose from "mongoose";

export default function validateModelFromPayloadHandler(Model: mongoose.Model<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = new Model(req.body);
      await doc.validate();
      next();
    } catch (err: any) {
      if (err?.name === 'ValidationError') throw new BadRequestError(err.message);

      next(err);
    }
  }
}
