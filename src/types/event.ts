import mongoose, { Document } from "mongoose";

export interface IEvent extends Document {
  name: string,
  startOn: Date,
  endOn: Date,
  participants: Array<mongoose.Types.ObjectId>
}
