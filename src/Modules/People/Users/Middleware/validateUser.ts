import { Request, Response, NextFunction } from 'express';
import { UserValidatorFactory } from '../Validators/userValidator';

export function validateUser() {
  return (req: Request, res: Response, next: NextFunction) => {
    const validator = UserValidatorFactory.create();

    const isValid = validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: validator.errors });
    }
    
    next();
  };
}