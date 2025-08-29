import { Request, Response, NextFunction } from 'express';
import { ClassValidatorFactory } from '../Validator/classValidate';

export function validateClass() {
  return (req: Request, res: Response, next: NextFunction) => {
    const validator = ClassValidatorFactory.create();

    const isValid = validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: validator.errors });
    }
    
    next();
  };
}