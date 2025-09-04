
import { CreateLessonController} from '../Lessons/Controller/CreateLessonController'
import { Router } from 'express';;
import { validateLesson } from '../Lessons/Middleware/validateLesson';

const routerLesson = Router();

routerLesson.post('/lesson', validateLesson(), new CreateLessonController().handle)

export{ routerLesson }