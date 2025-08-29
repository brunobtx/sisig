import { Request, Response, NextFunction } from 'express';
import { PersonValidatorFactory } from '../Validators/PersonValidator';

export function validatePerson() {
  return (req: Request, res: Response, next: NextFunction) => {
    const validator = PersonValidatorFactory.create();

    const isValid = validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: validator.errors });
    }
    
    next();
  };
}