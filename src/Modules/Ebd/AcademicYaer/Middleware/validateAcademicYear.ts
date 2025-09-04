import { Request, Response, NextFunction } from 'express';
import { AcademicYearValidatorFactory } from '../Validator/academicYearValidator';

export function validateAcademicYear() {
  return (req: Request, res: Response, next: NextFunction) => {
    const validator = AcademicYearValidatorFactory.create();

    const isValid = validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: validator.errors });
    }
    
    next();
  };
}