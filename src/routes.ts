import { Router } from "express"

import { userRoutes } from "./modules/people/user/presentation/routes/user.routes"
import { classRoutes } from "./modules/ebd/class/presentation/routes/class.routes"
import { turmaRoutes } from "./modules/ebd/turma/presentation/routes/turma.routes"
import { teacherRoutes } from "./modules/ebd/teacher/presentation/routes/teacher.routes"
import { studentRoutes } from "./modules/ebd/student/presentation/routes/student.routes"
import { classSessionRoutes } from "./modules/ebd/class-session/presentation/routes/class-session.routes"
import { reportRoutes } from "./modules/ebd/report/presentation/routes/report.routes"

import { personRoutes } from "./modules/people/person/presentation/routes/person.routes"
import { memberRoutes } from "./modules/people/member/presentation/routes/member.routes"
import { lessonRoutes } from "./modules/ebd/lesson/presentation/routes/lesson.routes"
import { academicYearRoutes } from "./modules/ebd/academic-year/presentation/routes/academic-year.routes"
import { accessControlRoutes } from "./modules/settings/access-control/presentation/routes/access-control.routes"
import { organizationRoutes } from "./modules/organization/organization/presentation/routes/organization.routes"

const router = Router();

router.use('/api', userRoutes)
router.use ('/api', personRoutes)
router.use ('/api', memberRoutes)
router.use ('/api', classRoutes)
router.use ('/api', turmaRoutes)
router.use ('/api', teacherRoutes)
router.use ('/api', studentRoutes)
router.use('/api', classSessionRoutes)
router.use('/api', reportRoutes)
router.use('/api', lessonRoutes)
router.use('/api', academicYearRoutes)
router.use('/api', accessControlRoutes)
router.use('/api', organizationRoutes)


export{ router}
