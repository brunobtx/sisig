import { Request, Response, NextFunction } from 'express';
import { LessonValidatorFactory } from '../Validator/lessonValidator';

export function validateLesson() {
  return (req: Request, res: Response, next: NextFunction) => {
    const validator = LessonValidatorFactory.create();

    const isValid = validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: validator.errors });
    }
    
    next();
  };
}