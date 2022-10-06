import { Router } from 'express'
import { create, listUsers, retrive, update, deleteOne } from '../controllers/user'

const router: Router = Router()
router.post('/', create)
router.get('/:id', retrive)
router.get('/', listUsers)
router.put('/:id', update)
router.delete('/:id', deleteOne)

export default router
