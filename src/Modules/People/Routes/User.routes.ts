import { CreateUserController } from '../Users/Controller/CreateUserController'
import { AuthUSerController } from "../Users/Controller/AuthUserController"
import { DetailUserController } from "../Users/Controller/DetailUserController"
import { isAutenticated } from "../../../Common/Middleware/isAuthenticated"
import { Router } from 'express';
import { validateUser } from '../Users/Middleware/validateUser';

const routerUser = Router();

//--ROTAS USER --//
routerUser.post('/user', isAutenticated, validateUser(), new CreateUserController().headle)
routerUser.post('/session', new AuthUSerController().handle)
routerUser.get('/details',isAutenticated, new DetailUserController().handle)

export{ routerUser }