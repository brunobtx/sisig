
import { CreateClassController} from '../Class/Controller/CreateClasseController'
import { AddTeacherToClassController } from '../Class/Controller/AddTeacherToClassController';
import { isAutenticated } from "../../../Common/Middilawere/isAuthenticated"
import { Router } from 'express';
import { router } from '../../../routes';

const routerClass = Router();

//--ROTAS PERSON --//
routerClass.post('/class', new CreateClassController().handle)
routerClass.post('/class/teacher', new AddTeacherToClassController().handle)

export{ routerClass }