import { Router } from 'express'
import { AuthUserController } from './controllers/user/AuthUserController'
import { CreateUserController } from './controllers/user/CreateUserController'
import { DeleteUserController } from './controllers/user/DeleteUserController'
import { DetailUserController } from './controllers/user/DetailUserController'
import { UpdateUserController } from './controllers/user/UpdateUserController'
import { isAuthenticated } from './middlewares/isAuthenticated'

const router = Router()

router.post('/users', new CreateUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated, new DetailUserController().handle)
router.put('/users', isAuthenticated, new UpdateUserController().handle)
router.delete('/users', isAuthenticated, new DeleteUserController().handle)

export { router }
