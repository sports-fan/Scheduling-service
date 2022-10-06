import { Router } from 'express'
import {
  create,
  listEvents,
  retrive,
  update,
  deleteOne,
  addParticipants,
  removeParticipants,
  updateUserStatus
} from '../controllers/event'

const router: Router = Router()
router.post('/', create)
router.get('/:id', retrive)
router.get('/', listEvents)
router.put('/:id', update)
router.put('/:id/add-participants', addParticipants)
router.put('/:id/remove-participants', removeParticipants)
router.put('/:id/update-status', updateUserStatus)
router.delete('/:id', deleteOne)

export default router
