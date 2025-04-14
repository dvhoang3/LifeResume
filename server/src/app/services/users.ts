import EntityNotFoundError from "../errors/entity-not-found-error";
import { IUser, User } from "../models/user";

async function login(username: string, password: string): Promise<IUser> {
  const user: IUser | null = await User.findOne({ username });
  if (user == null) throw new EntityNotFoundError(User, { username }); 

  return user;
}

async function signUp(userModel: IUser): Promise<IUser> {
  return await User.create(userModel);
}

async function updateUser(id: string, dataModel: IUser): Promise<IUser> {
  const user: IUser | null = await User.findByIdAndUpdate(id, dataModel, { new: true, runValidators: true });
  if (user == null) throw new EntityNotFoundError(User, { id });
  
  return user;
}

export default {
  login,
  signUp,
  updateUser,
};