import { Router } from 'express'
import {
  create,
  findAll,
  findOne,
  update,
  deleteOne,
  deleteAll,
  addParticipants,
  removeParticipants,
  updateUserPermission
} from '../controllers/event'

const router: Router = Router()
router.post('/', create)
router.get('/:id', findOne)
router.get('/', findAll)
router.put('/:id', update)
router.put('/:id/add-participants', addParticipants)
router.put('/:id/remove-participants', removeParticipants)
router.put('/:id/update-permissions', updateUserPermission)
router.delete('/:id', deleteOne)
router.delete('/', deleteAll)

export default router
