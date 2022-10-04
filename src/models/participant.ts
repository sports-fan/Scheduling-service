import { model, Schema } from 'mongoose'
import { IParticipant } from "../types/participant";

const participantSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isHost: {
      type: Boolean,
      required: true
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    isAccepted: {
      type: Boolean,
      default: false
    }
  },
  {timestamps: true}
)

export default model<IParticipant>('participant', participantSchema)
