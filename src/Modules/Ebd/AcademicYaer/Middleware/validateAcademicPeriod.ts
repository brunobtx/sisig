import { Request, Response, NextFunction } from 'express';
import { AcademicPeriodValidatorFactory } from '../Validator/academicPeriodValidator';

export function validateAcademicPeriod() {
  return (req: Request, res: Response, next: NextFunction) => {
    const validator = AcademicPeriodValidatorFactory.create();

    const isValid = validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: validator.errors });
    }
    
    next();
  };
}