import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateMemberUseCase } from '../../application/use-cases/create-member.use-case';
import { PrismaMemberRepository } from '../../infra/repositories/prisma-member.repository';
import { CreateMemberController } from '../controllers/create-member.controller';
import { MemberValidatorFactory } from '../validators/member.validator';

const memberRoutes = Router();
const repository = new PrismaMemberRepository();

const createMemberController = new CreateMemberController(
  new CreateMemberUseCase(repository),
  MemberValidatorFactory.create(),
);

memberRoutes.use(isAutenticated);
memberRoutes.post('/members', requirePermission('members:create'), createMemberController.handle);

export { memberRoutes };
