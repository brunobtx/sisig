
import { CreatePersonController} from '../People/Controller/CreatePersonController'
import { validatePerson } from '../People/Middleware/ValidatePerson';
import { isAutenticated } from "../../../Common/Middleware/isAuthenticated"
import { Router } from 'express';

const routerPerson = Router();

//--ROTAS PERSON --//
routerPerson.post('/person', validatePerson(), new CreatePersonController().handle)

export{ routerPerson }