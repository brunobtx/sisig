import { isAutenticated } from "../../../../../Common/Middleware/isAuthenticated";
import { Router } from 'express';
import { CreatePersonController} from '..//Http/Controller/createPersonController'
import { DeletePersonController } from '../Http/Controller/deletePersonController';
import { UpdatePersonController } from "../Http/Controller/updatePersonController";
import { ListPersonController } from "../Http/Controller/listPersonController";
import { DetailPersonController } from "../Http/Controller/detailPersonController";

const routerPerson = Router();

routerPerson.use(isAutenticated);

//-- ROTAS PERSON --//
routerPerson.post('/persons', new CreatePersonController().handle);
routerPerson.get('/persons', new ListPersonController().handle);
routerPerson.get('/persons/:uuid', new DetailPersonController().handle);
routerPerson.patch('/persons/:uuid', new UpdatePersonController().handle);
routerPerson.delete('/persons/:uuid', new DeletePersonController().handle);


export{ routerPerson }