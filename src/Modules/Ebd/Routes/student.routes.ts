
import { CreateStudentController} from '../Students/Controller/CreateStudentController'
import { isAutenticated } from "../../../Common/Middleware/isAuthenticated"
import { Router } from 'express';

const routerStudent = Router();

routerStudent.post('/student', new CreateStudentController().handle)

export{ routerStudent }