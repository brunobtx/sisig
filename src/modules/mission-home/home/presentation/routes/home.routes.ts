import { Router } from 'express';
import { CreateHomeUseCase } from '../../application/use-cases/create-home.use-case';
import { PrismaHomeRepository } from '../../infra/repositories/prisma-home.repository';
import { CreateHomeController } from '../controllers/create-home.controller';
import { HomeValidatorFactory } from '../validators/home.validator';

const homeRoutes = Router();

const repository = new PrismaHomeRepository();
const createHomeController = new CreateHomeController(
  new CreateHomeUseCase(repository),
  HomeValidatorFactory.create(),
);

homeRoutes.post('/homes', createHomeController.handle);

export { homeRoutes };
