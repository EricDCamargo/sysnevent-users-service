import { Router } from 'express'
import { AuthUserController } from './controllers/user/AuthUserController'
import { CreateUserController } from './controllers/user/CreateUserController'
import { DeleteUserController } from './controllers/user/DeleteUserController'
import { DetailUserController } from './controllers/user/DetailUserController'
import { UpdateUserController } from './controllers/user/UpdateUserController'
import { isAdmin, isAuthenticated } from './middlewares/isAuthenticated'
import { ListUsersController } from './controllers/user/ListUsersController'
import { ResetPasswordController } from './controllers/user/ResetPasswordController'

const router = Router()

router.post('/users', isAuthenticated, isAdmin, new CreateUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated, new DetailUserController().handle)
router.put('/users', isAuthenticated, isAdmin, new UpdateUserController().handle)
router.delete('/users', isAuthenticated, isAdmin, new DeleteUserController().handle)
router.get('/users', isAuthenticated, isAdmin, new ListUsersController().handle)
router.post('/register-secret', isAuthenticated, new ResetPasswordController().registerSecretWord)
router.post('/reset-password', new ResetPasswordController().resetPassword)

export { router }
