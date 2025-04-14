import EntityNotFoundError from "../errors/entity-not-found-error";
import UnauthorizedError from "../errors/unauthorized-error";
import { IUser, User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import config from '../../config/config';

async function authorizeUser(id: string): Promise<string> {
  const accessToken: string = jwt.sign(
    { id },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: 15 * 60 },
  );

  return accessToken;
}

async function login(username: string, password: string): Promise<string> {
  const user: IUser | null = await User.findOne({ username })
    .select(['+username', '+password']);
  if (user == null) throw new EntityNotFoundError(User, { username });

  if (!await bcrypt.compare(password, user.password)) throw new UnauthorizedError();

  return user._id.toString();
}

async function signUp(userModel: IUser): Promise<string> {
  const hashedPassword = await bcrypt.hash(userModel.password, 10);
  const user = await User.create({
    ...userModel,
    password: hashedPassword,
  });

  return user._id.toString();
}

async function getUserById(id: string): Promise<IUser> {
  const user: IUser | null = await User.findById(id);
  if (user == null) throw new EntityNotFoundError(User, { id });
  return user;
}

async function updateUser(id: string, dataModel: Partial<IUser>): Promise<IUser> {
  const { username, password, ...userObject } = dataModel;
  const user: IUser | null = await User.findByIdAndUpdate(id, userObject, { new: true, runValidators: true });
  if (user == null) throw new EntityNotFoundError(User, { id });
  return user;
}

export default {
  authorizeUser,
  login,
  signUp,
  getUserById,
  updateUser,
};