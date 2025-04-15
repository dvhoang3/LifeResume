import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.ObjectId;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  linkedIn?: string;
  gitHub?: string;
  desiredRole?: string;
}
type UserModel =  mongoose.Model<IUser>;

const userSchema: mongoose.Schema<IUser, UserModel> = new mongoose.Schema<IUser, UserModel>({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    lowercase: true,
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
    required: false,
    validate: [
      {
        validator: function(value: string) {
          return /^\S+@\S+\.\S+$/.test(value);
        },
        message: 'Email format is invalid.',
      },
    ],
  },
  phoneNumber: {
    type: String,
    required: false,
    validate: [
      {
        validator: function(value: string) {
          return /^[1-9]\d{2}-\d{3}-\d{4}$/.test(value);
        },
        message: 'Phone number format is invalid.',
      },
    ],
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

export const User: UserModel = mongoose.model<IUser, UserModel>('User', userSchema);