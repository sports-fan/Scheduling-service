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
      type: Schema.Types.ObjectId,
      ref: 'Participant',
      required: false
    }]
  },
  {timestamps: true}
)

export default model<IEvent>('event', eventSchema)
