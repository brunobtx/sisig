
import { CreateClassSessionController} from '../ClassSession/Controller/CreateClassSessionController'
import { Router } from 'express';;
import { validateClassSession } from '../ClassSession/Middleware/validateClassSession';

const routerClassSession = Router();

routerClassSession.post('/class-session', validateClassSession(), new CreateClassSessionController().handle)

export{ routerClassSession }