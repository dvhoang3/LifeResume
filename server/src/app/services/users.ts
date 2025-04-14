import EntityNotFoundError from "../errors/entity-not-found-error";
import UnauthorizedError from "../errors/unauthorized-error";
import { IUser, User } from "../models/user";
import bcrypt from "bcryptjs";

async function login(username: string, password: string): Promise<IUser> {
  const user: IUser | null = await User.findOne({ username })
    .select(['+username', '+password']);
  if (user == null) throw new EntityNotFoundError(User, { username });

  if (!await bcrypt.compare(password, user.password)) throw new UnauthorizedError();

  // TODO: username and password being returned here, get rid of them
  return user;
}

async function signUp(userModel: IUser): Promise<IUser> {
  userModel.password = await bcrypt.hash(userModel.password, 10);

  // TODO: username and password being returned, get rid of them -- might get rid if we need jwt stuff anyways
  return await User.create(userModel);
}

async function updateUser(id: string, dataModel: Partial<IUser>): Promise<IUser> {
  const { username, password, ...partialUserModelForUpdate } = dataModel;
  const user: IUser | null = await User.findByIdAndUpdate(id, partialUserModelForUpdate, { new: true, runValidators: true });
  if (user == null) throw new EntityNotFoundError(User, { id });
  
  return user;
}

export default {
  login,
  signUp,
  updateUser,
};