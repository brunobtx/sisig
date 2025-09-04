import { Router} from "express"
import multer from "multer"

import { isAutenticated } from "./Common/Middleware/isAuthenticated"

import { routerUser } from "./Modules/People/Routes/User.routes"
import { routerClass } from "./Modules/Ebd/Routes/classe.routes"
import { routerTeacher } from "./Modules/Ebd/Routes/teacher.routes"
import { routerStudent } from "./Modules/Ebd/Routes/student.routes"
import { routerClassSession } from "./Modules/Ebd/Routes/classSession.routes"

import uploadConfig from './config/multer'
import { routerPerson } from "./Modules/People/Routes/Person.routes"
import { routerLesson } from "./Modules/Ebd/Routes/lesson.routes"
import { routerAcademic } from "./Modules/Ebd/Routes/academicYear.routes"

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

router.use('/api', routerUser)
router.use ('/api', routerPerson)
router.use ('/api', routerClass)
router.use ('/api', routerTeacher)
router.use ('/api', routerStudent)
router.use('/api', routerClassSession)
router.use('/api', routerLesson)
router.use('/api', routerAcademic)


export{ router}