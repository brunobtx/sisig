
import { CreateClassController} from '../Class/Controller/CreateClasseController'
import { AddTeacherToClassController } from '../Class/Controller/AddTeacherToClassController';
import { AddStudentToClassController } from '../Class/Controller/AddStudentToClassController';
import { isAutenticated } from "../../../Common/Middleware/isAuthenticated"
import { Router } from 'express';
import { router } from '../../../routes';
import { validateClass } from '../Class/Middleware/validateClass';

const routerClass = Router();

//--ROTAS PERSON --//
routerClass.post('/class', validateClass(), new CreateClassController().handle)
routerClass.post('/class/teacher', new AddTeacherToClassController().handle)
routerClass.post('/class/student', new AddStudentToClassController().handle)

export{ routerClass }