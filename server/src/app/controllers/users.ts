import { Request, Response } from "express";
import usersService from "../services/users";
import { IUser } from "../models/user";

async function login(req: Request<{}, {}, IUser>, res: Response<IUser>): Promise<void> {
  const { username, password }: { username: string, password: string } = req.body;
  const user: IUser = await usersService.login(username, password);
  res.status(200).json(user);
}

async function signUp(req: Request<{}, {}, IUser>, res: Response<IUser>): Promise<void> {
  const userModel: IUser = req.body;
  const user: IUser = await usersService.signUp(userModel);
  res.status(201).json(user);
}

async function updateUser(req: Request<{ id: string }, {}, IUser>, res: Response<IUser>): Promise<void> {
  const id: string = req.params.id;
  const dataModel: IUser = req.body;
  res.json(await usersService.updateUser(id, dataModel));
}

export default {
  login,
  signUp,
  updateUser,
}