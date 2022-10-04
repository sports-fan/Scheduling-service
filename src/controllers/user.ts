import { Response, Request } from 'express'
import { IUser } from '../types/user'
import User from '../models/user'
import { ReplOptions } from 'repl'
  
const create = async (req: Request, res: Response): Promise<void> => {
  const {firstName, lastName} = req.body
  const user: IUser = new User({
    firstName,
    lastName
  })

  try {
    const newUser: IUser = await user.save()
    res.send(newUser)
  } catch(error) {
    res.status(500).send({
      message: error || 'Some error occured while creating the event.'
    })
  }
}

const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] | [] = await User.find({})
    res.send(users)
  } catch(error) {
    res.status(500).send({
      message: error || 'Some error occurred while retriving users.'
    })
  }
}

// Find a single user with an id
const findOne = async (req: Request, res: Response): Promise<void> => {
  const id =  req.params.id
  try {
    const user: IUser | null = await User.findById(id).exec()
    if(!user) {
      res.status(404).send({message: "Not found user with id" + id})
    } else {
      res.send(user)
    }
  } catch (ex) {
    res.status(500).send({
      message: "Error retrieving user with id=" + id 
    })
  }
};

// Update a user by the id in the request
const update = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  try {
    const updatedUser: IUser | null = await User.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
    if(!updatedUser) {
      res.status(404).send({
        message: `Cannot update User with id=${id}. Maybe User was not found!`
      });
    } else {
      res.send({
        message: "User was updated successfully."
      })
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating user with id=" + id
    });
  }
  
};

// Delete a user with the specified id in the request
const deleteOne = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  try {
    const deletedUser: IUser | null = await User.findByIdAndRemove(id)
    if(!deletedUser) {
      res.status(404).send({
        message: `Cannot delete User with id=${id}. Maybe User was not found!`
      });
    } else {
      res.send({
        message: "User was deleted successfully."
      })
    }
  } catch (err) {
    res.status(500).send({
      message: "Error deleting user with id=" + id
    });
  }
};

// Delete all Events from the database.
const deleteAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedUsers: any = await User.deleteMany({})
    res.send({
      message: `${deletedUsers.deletedCount} Users were deleted successfully!`
    })
  } catch (ex) {
    res.status(500).send({
      message: "Error deleting all users"
    });
  }
};

export { create, findAll, findOne, update, deleteOne, deleteAll }
