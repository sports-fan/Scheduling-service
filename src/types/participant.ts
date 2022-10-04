import mongoose, { Document } from "mongoose";

export interface IParticipant extends Document {
  userId: mongoose.Types.ObjectId,
  isHost: boolean,
  isRequired: boolean,
  isAccepted: boolean
}
