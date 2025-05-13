import { Router } from 'express'
import { AuthParticipantController } from './controllers/AuthParticipantController'
import { CreateParticipantController } from './controllers/CreateParticipantController'
import { DetailParticipantController } from './controllers/DetailParticipantController'
import { isAuthenticated } from './middlewares/isAuthenticated'

const router = Router()

router.post('/users', new CreateParticipantController().handle)
router.post('/session', new AuthParticipantController().handle)
router.get('/me', isAuthenticated, new DetailParticipantController().handle)

export { router }
