import { Router } from 'express'
import { create, findAll, findOne, update, deleteOne, deleteAll } from '../controllers/event'

const router: Router = Router()
router.post('/', create)
router.get('/:id', findOne)
router.get('/', findAll)
router.put('/:id', update)
router.delete('/:id', deleteOne)
router.delete('/', deleteAll)

export default router
