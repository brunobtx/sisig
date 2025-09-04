
import { CreateAcademicYearController} from '../AcademicYaer/Controller/createAcademicYearController'
import { AddAcademicPeriodController} from '../AcademicYaer/Controller/addAcademicPeriodController'
import { Router } from 'express';;
import { validateAcademicYear } from '..//AcademicYaer/Middleware/validateAcademicYear';
import { validateAcademicPeriod } from '..//AcademicYaer/Middleware/validateAcademicPeriod';

const routerAcademic = Router();

routerAcademic.post('/academic-year', validateAcademicYear(), new CreateAcademicYearController().handle)
routerAcademic.post('/academic-period', validateAcademicPeriod(), new AddAcademicPeriodController().handle)

export{ routerAcademic }