import mongoose, { Document, Schema } from "mongoose";

/** Interface representing the User object */
export interface IUser {
  name: string;
  viewed: boolean;
  description: string;
  status: string;
}

export interface IUserModel extends IUser, Document {}

/** Defining the UserSchema */
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    viewed: { type: String, default: null },
    description: { type: String, default: null },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserModel>("User", UserSchema);
