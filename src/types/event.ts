import mongoose, { Document } from "mongoose";


interface IParticipant {
  user: mongoose.Types.ObjectId,
  isHost: boolean,
  isRequired: boolean,
  isAccepted: boolean
}
export interface IEvent extends Document {
  name: string,
  startAt: Date,
  endAt: Date,
  participants: Array<IParticipant>
}
