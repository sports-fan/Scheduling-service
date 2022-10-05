import { model, Schema } from 'mongoose'
import { IUser } from "../types/user";

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  {timestamps: true}
)

export default model<IUser>('user', userSchema)
