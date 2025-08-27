
import { CreatePersonController} from '../People/Controller/CreatePersonController'
import { isAutenticated } from "../../../Common/Middilawere/isAuthenticated"
import { Router } from 'express';

const routerPerson = Router();

//--ROTAS PERSON --//
routerPerson.post('/person', new CreatePersonController().handle)

export{ routerPerson }