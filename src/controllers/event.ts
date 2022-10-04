import { Response, Request } from 'express'
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
    res.send(newEvent)
  } catch(error) {
    res.status(500).send({
      message: error || 'Some error occured while creating the event.'
    })
  }
}

const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const events: IEvent[] | [] = await Event.find({})
    res.send(events)
  } catch(error) {
    res.status(500).send({
      message: error || 'Some error occurred while retriving events.'
    })
  }
}

// Find a single event with an id
const findOne = async (req: Request, res: Response): Promise<void> => {
  const id =  req.params.id
  try {
    const event: IEvent | null = await Event.findById(id).exec()
    if(!event) {
      res.status(404).send({message: "Not found event with id" + id})
    } else {
      res.send(event)
    }
  } catch (ex) {
    res.status(500).send({
      message: "Error retrieving event with id=" + id 
    })
  }
};

// Update a event by the id in the request
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
        message: "Event was updated successfully."
      })
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating event with id=" + id
    });
  }
};

// Delete a event with the specified id in the request
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

export { create, findAll, findOne, update, deleteOne, deleteAll }
