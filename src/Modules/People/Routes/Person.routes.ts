import { isAutenticated } from "../../../Common/Middleware/isAuthenticated"
import { Router } from 'express';
import { CreatePersonController} from '../People/Controller/createPersonController'
import { DeletePersonController } from '../People/Controller/deletePersonController';
import { UpdatePersonController } from "../People/Controller/updatePersonController";
import { ListPersonController } from "../People/Controller/listPersonController";
import { DetailPersonController } from "../People/Controller/detailPersonController";

const routerPerson = Router();

//--ROTAS PERSON --//
routerPerson.post('/person/create', isAutenticated, new CreatePersonController().handle)
routerPerson.post('/person/delete', isAutenticated, new DeletePersonController().handle)
routerPerson.post('/person/update', isAutenticated, new UpdatePersonController().handle)
routerPerson.get('/person', isAutenticated, new ListPersonController().handle)
routerPerson.get('/person/detail', isAutenticated, new DetailPersonController().handle)

export{ routerPerson }