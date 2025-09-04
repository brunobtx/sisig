import { Request, Response, NextFunction } from 'express';
import { ClassSessionValidatorFactory } from '../Validator/classSessionValidator';

export function validateClassSession() {
  return (req: Request, res: Response, next: NextFunction) => {
    const validator = ClassSessionValidatorFactory.create();

    const isValid = validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: validator.errors });
    }
    
    next();
  };
}