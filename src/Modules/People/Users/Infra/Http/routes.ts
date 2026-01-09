import { CreateUserController } from './Controller/CreateUserController'
import { AuthUserController } from "./Controller/AuthUserController"
import { DetailUserController } from "./Controller/DetailUserController"
import { isAutenticated } from "../../../../../Common/Middleware/isAuthenticated"
import { Router } from 'express';

const routerUser = Router();

//--ROTAS USER --//
routerUser.post('/user/create', isAutenticated, new CreateUserController().handle)
routerUser.post('/session', new AuthUserController().handle)
routerUser.get('/details',isAutenticated, new DetailUserController().handle)

export{ routerUser }