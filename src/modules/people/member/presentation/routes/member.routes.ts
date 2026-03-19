import { Router } from 'express';
import { isAutenticated } from '../../../../../shared/infra/middlewares/isAuthenticated';
import { requirePermission } from '../../../../../shared/infra/middlewares/authorize';
import { CreateMemberUseCase } from '../../application/use-cases/create-member.use-case';
import { ListMemberUseCase } from '../../application/use-cases/list-member.use-case';
import { PrismaMemberRepository } from '../../infra/repositories/prisma-member.repository';
import { CreateMemberController } from '../controllers/create-member.controller';
import { ListMemberController } from '../controllers/list-member.controller';
import { MemberValidatorFactory } from '../validators/member.validator';

const memberRoutes = Router();
const repository = new PrismaMemberRepository();

const createMemberController = new CreateMemberController(
  new CreateMemberUseCase(repository),
  MemberValidatorFactory.create(),
);
const listMemberController = new ListMemberController(
  new ListMemberUseCase(repository),
);

memberRoutes.use(isAutenticated);
memberRoutes.get('/members', requirePermission('members:read'), listMemberController.handle);
memberRoutes.post('/members', requirePermission('members:create'), createMemberController.handle);

export { memberRoutes };
