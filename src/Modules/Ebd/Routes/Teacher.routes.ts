
import { CreateTeacherController} from '../Teachers/Controller/CreateTeacherController';
import { isAutenticated } from "../../../Common/Middilawere/isAuthenticated"
import { Router } from 'express';

const routerTeacher = Router();

//--ROTAS PERSON --//
routerTeacher.post('/teacher', new CreateTeacherController().handle)

export{ routerTeacher }