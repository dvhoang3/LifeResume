import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import BadRequestError from "../errors/bad-request-error";

export default function validateObjectIdFromRouteHandler(req: Request, res: Response, next: NextFunction): void {
  const id: string = req.params.id;
  if (!isValidObjectId(id)) throw new BadRequestError("Id is not in proper format.");

  next();
}