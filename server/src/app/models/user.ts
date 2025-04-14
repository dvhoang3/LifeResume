import { Model, ObjectId, Schema, model } from 'mongoose';

export interface IUser {
  _id: ObjectId;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  linkedIn?: string;
  gitHub?: string;
  desiredRole?: string;
}
type UserModel =  Model<IUser>;

const userSchema: Schema<IUser, UserModel> = new Schema<IUser, UserModel>({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    select: false,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    select: false,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    validate: [
      {
        validator: function(value: string) {
          return /^\S+@\S+\.\S+$/.test(value);
        },
        message: 'Email format is invalid.'
      }
    ]
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  linkedIn: {
    type: String,
    required: false,
  },
  gitHub: {
    type: String,
    required: false,
  },
  desiredRole: {
    type: String,
    required: false,
  },
});

export const User: UserModel = model<IUser, UserModel>('User', userSchema);