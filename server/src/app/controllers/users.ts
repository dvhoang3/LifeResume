import { Request, Response } from "express";
import usersService from "../services/users";
import { IUser } from "../models/user";
import config from "../../config/config";

async function login(req: Request<{}, {}, { username: string, password: string }>, res: Response<IUser>): Promise<void> {
  const { username, password }: { username: string, password: string } = req.body;
  const userId: string = await usersService.login(username, password);

  const token = usersService.authorizeUser(userId);
  res.cookie('jwt', token, { httpOnly: true, maxAge: 15 * 60 * 1000, secure: config.PRODUCTION_ENV });

  res.status(200).json(await usersService.getUserById(userId));
}

async function signUp(req: Request<{}, {}, IUser>, res: Response<IUser>): Promise<void> {
  const userModel: IUser = req.body;
  const userId: string = await usersService.signUp(userModel);

  const token = usersService.authorizeUser(userId);
  res.cookie('jwt', token, { httpOnly: true, maxAge: 15 * 60 * 1000, secure: config.PRODUCTION_ENV });

  res.status(201).json(await usersService.getUserById(userId));
}

async function updateUser(req: Request<{ id: string }, {}, Partial<IUser>>, res: Response<IUser>): Promise<void> {
  const id: string = req.params.id;
  const dataModel: Partial<IUser> = req.body;
  res.json(await usersService.updateUser(id, dataModel));
}

export default {
  login,
  signUp,
  updateUser,
}