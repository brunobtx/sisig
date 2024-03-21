import { Router} from "express"
import multer from "multer"

import { isAutenticated } from "./Middilawere/isAuthenticated"

import { CreateUserController } from './Users/Controller/CreateUserController'
import { AuthUSerController } from "./Users/Controller/AuthUserController"
import { DetailUserController } from "./Users/Controller/DetailUserController"
import { CreateCategoryController } from "./Category/Controller/CreateCategoryController"
import { ListCategoryController } from "./Category/Controller/ListCategoryController"

import { CreateProductController } from "./Products/Controller/CreateProductController"
import { ListProductByCategoryController } from "./Products/Controller/ListProductController"

import { CreateOrderController } from "./Order/Controller/CreateOrderController"
import { RemoveOrderController } from "./Order/Controller/RemoveOrderController"
import { AddItensController } from "./Order/Controller/AddItensController"

import uploadConfig from './config/multer'

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

//--ROTAS USER --//
router.post('/users', new CreateUserController().headle)
router.post('/session', new AuthUSerController().handle)
router.get('/details',isAutenticated, new DetailUserController().handle)

//--ROTAS CATEGORY --//
router.post('/category', isAutenticated, new CreateCategoryController().handle)
router.get('/category',  isAutenticated, new ListCategoryController().handle) 

//--ROTAS PRODUCTS --//
router.post('/product', isAutenticated, upload.single('file'), new CreateProductController().handle)
router.get('/category/product', isAutenticated, new ListProductByCategoryController().handle)

//--ROTAS ORDERS --//
router.post('/order', isAutenticated, new CreateOrderController().handle)
router.delete('/order/delete', isAutenticated, new RemoveOrderController().handle)
router.post('/order/add' , isAutenticated, new AddItensController().handle)

export{ router}