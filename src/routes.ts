import { Router} from "express"
import multer from "multer"

import { isAutenticated } from "./Common/Middilawere/isAuthenticated"

import { routerUser } from "./Modules/People/Routes/User.routes"
import { routerClass } from "./Modules/Ebd/Routes/Classe.routes"
import { routerTeacher } from "./Modules/Ebd/Routes/Teacher.routes"

import uploadConfig from './config/multer'
import { routerPerson } from "./Modules/People/Routes/Person.routes"

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

router.use('/api', routerUser)
router.use ('/api', routerPerson)
router.use ('/api', routerClass)
router.use ('/api', routerTeacher)



export{ router}