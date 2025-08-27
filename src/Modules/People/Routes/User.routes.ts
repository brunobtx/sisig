import { CreateUserController } from '../Users/Controller/CreateUserController'
import { AuthUSerController } from "../Users/Controller/AuthUserController"
import { DetailUserController } from "../Users/Controller/DetailUserController"
import { isAutenticated } from "../../../Common/Middilawere/isAuthenticated"
import { Router } from 'express';

const routerUser = Router();

//--ROTAS USER --//
routerUser.post('/user', new CreateUserController().headle)
routerUser.post('/session', new AuthUSerController().handle)
routerUser.get('/details',isAutenticated, new DetailUserController().handle)

export{ routerUser }