import { Response, Request } from 'express'
import mongoose from 'mongoose'

import { IEvent } from '../types/event'
import Event from '../models/event'

const create = async (req: Request, res: Response): Promise<void> => {
  const {name, startOn, endOn, participants } = req.body
  const event: IEvent = new Event({
    name,
    startOn,
    endOn,
    participants
  })

  try {
    const newEvent: IEvent = await event.save()
    res.status(201).send({data: newEvent})
  } catch(error) {
    res.status(500).send({
      message: error || 'Some error occured while creating the event.'
    })
  }
}

const findAll = async (req: Request, res: Response): Promise<void> => {
  const { from, to, hostId, participantId } = req.query
  const { detail } = req.body
  let conditionArray:Array<object> = []

  if(from) conditionArray.push({"endOn": {$gte: new Date(from as string)}})
  if(to) conditionArray.push({"startOn": {$lte: new Date(to as string)}})
  if(hostId) conditionArray.push({"participants._id": hostId})
  if(participantId) conditionArray.push({"participants._id": participantId})

  let condition:any ={}
  if(conditionArray.length > 0) {
    condition = {
      $and: conditionArray
    }
  }

  try {
    let events: IEvent[] | []
    if(detail) {
      events = await Event.find(condition).populate({
        path: 'participants',
        populate: {
          path: 'user',
          model: 'user',
          select: '_id firstName lastName email'
        }
      })
    } else {
      events = await Event.find(condition)
    }
    res.send({data: events})
  } catch(error) {
    res.status(500).send({
      message: error || 'Some error occurred while retriving events.'
    })
  }
}

// Find a single event with an id
const findOne = async (req: Request, res: Response): Promise<void> => {
  const id =  req.params.id
  const { detail } = req.body
  try {
    let event: IEvent | null
    if(detail) {
      event = await Event.findById(id).populate({
        path: 'participants',
        populate: {
          path: 'user',
          model: 'user',
          select: '_id firstName lastName email'
        }
      })
    } else {
      event = await Event.findById(id)
    }
    if(!event) {
      res.status(404).send({message: "Not found event with id=" + id})
    } else {
      res.send({data: event})
    }
  } catch (ex) {
    res.status(500).send({
      message: "Error retrieving event with id=" + id 
    })
  }
};

// Update an event by the id in the request
const update = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  try {
    const updatedevent: IEvent | null = await Event.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
    if(!updatedevent) {
      res.status(404).send({
        message: `Cannot update Event with id=${id}. Maybe Event was not found!`
      });
    } else {
      res.send({
        message: "Event was updated successfully.",
        data: updatedevent
      })
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating event with id=" + id
    });
  }
};

// Add participants to an event by the id in the request
const addParticipants = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  const participants = req.body

  try {
    const addedEvent = await Event.updateOne(
      {_id: mongoose.Types.ObjectId(id)},
      {$push: {participants: {$each: participants}}}
    )

    if(addedEvent.nModified == 0) {
      res.status(404).send({
        message: `Cannot add participants with event id=${id}. Maybe Event was not found!`
      });
    } else {
      res.status(200).send({
        message: "participants were added successfully.",
      })
    }
  } catch (err) {
    res.status(500).send({
      message: "Error adding participants with id=" + id
    });
  }
};


// Remove participants from an event by the id and user ids in the request
const removeParticipants = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  const participants: Array<any> = req.body
  const updateOperationArray:Array<any> = []
  participants.map(userId => {
    updateOperationArray.push({
      updateOne: {
        "filter":{_id: mongoose.Types.ObjectId(id) },
        "update": {$pull: {participants: {user: {_id: [userId]}}}}
      }
    })
  })


  try {
    const removedEvent = await Event.bulkWrite(updateOperationArray)
    if(removedEvent.result?.nMatched == 0) {
      res.status(404).send({
        message: `Cannot remove participants with event id=${id}. Maybe Event was not found!`
      });
    } else {
      res.send({
        message: "Participants were removed from the event successfully.",
      })
    }
  } catch (err) {
    res.status(500).send({
      message: "Error removing participants with event id=" + id
    });
  }
};


const updateUserPermission = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  const { user, isHost, isRequired, isAccepted } = req.body
  if(!user) {
    res.status(500).send({
      message: "Can not update permissions without user id"
    })
  }

  try {
    const result = await Event.updateOne(
      {"_id": mongoose.Types.ObjectId(id), "participants.user": user},
      {$set: {
        "participants.$.isHost": isHost,
        "participants.$.isRequired": isRequired,
        "participants.$.isAccepted": isAccepted
      }},
    )
    if(!result) {
      res.status(404).send({
        message: `Cannot update Event with id=${id}. Maybe Event was not found!`
      });
    } else {
      res.send({
        message: "Event was updated successfully.",
        data: result
      })
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating user permissions with id=" + id
    })
  }
}

// Delete an event with the specified id in the request
const deleteOne = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  try {
    const deletedevent: IEvent | null = await Event.findByIdAndRemove(id)
    if(!deletedevent) {
      res.status(404).send({
        message: `Cannot delete Event with id=${id}. Maybe Event was not found!`
      });
    } else {
      res.send({
        message: "Event was deleted successfully."
      })
    }
  } catch (err) {
    res.status(500).send({
      message: "Error deleting event with id=" + id
    });
  }
};

// Delete all Events from the database.
const deleteAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedevents: any = await Event.deleteMany({})
    res.send({
      message: `${deletedevents.deletedCount} events were deleted successfully!`
    })
  } catch (ex) {
    res.status(500).send({
      message: "Error deleting all events"
    });
  }
};

export { create, findAll, findOne, update, deleteOne, deleteAll, addParticipants, updateUserPermission, removeParticipants }
