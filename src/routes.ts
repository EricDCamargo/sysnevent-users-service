import { Router } from 'express'
import { AuthParticipantController } from './controllers/participant/AuthParticipantController'
import { CreateParticipantController } from './controllers/participant/CreateParticipantController'
import { DetailParticipantController } from './controllers/participant/DetailParticipantController'
import { isAuthenticated } from './middlewares/isAuthenticated'
import { UpdateParticipantController } from './controllers/participant/UpdateParticipantController'
import { DeleteParticipantController } from './controllers/participant/DeleteParticipantController'

const router = Router()

router.post('/users', new CreateParticipantController().handle)
router.post('/session', new AuthParticipantController().handle)
router.get('/me', isAuthenticated, new DetailParticipantController().handle)
router.put('/users', isAuthenticated, new UpdateParticipantController().handle)
router.delete('/users', isAuthenticated, new DeleteParticipantController().handle
)

export { router }
