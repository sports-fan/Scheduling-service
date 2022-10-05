import { model, Schema } from 'mongoose'
import { IEvent } from "../types/event";

const eventSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startOn: {
      type: Date,
      default: Date.now
    },
    endOn: {
      type: Date,
      required: true
    },
    participants: [{
      user: {
        type: Schema.Types.ObjectId,
        required: true
      },
      isHost: {
        type: Boolean,
        required: true
      },
      isRequired: {
        type: Boolean,
        default: true
      },
      isAccepted: {
        type: Boolean,
        default: false
      }
    }]
  },
  {timestamps: true}
)

export default model<IEvent>('event', eventSchema)
