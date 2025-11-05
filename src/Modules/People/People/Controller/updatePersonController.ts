import { Request, Response } from 'express';
import { UpdatePersonService } from '../Service/updatePersonService';
import { PersonInput } from '../Dto/personInput';
import { PersonValidatorFactory } from '../Validator/PersonValidator';
import { PersonOutputMapper } from '../Dto/personOutput';

export class UpdatePersonController {
  async handle(req: Request, res: Response) {
    try {
      const id = req.body.uuid; 
      const input: PersonInput = req.body;
      const validator = PersonValidatorFactory.create();

      if (!validator.validate(input)) {
        return res.status(400).json({ errors: validator.errors });
      }

      // 2️⃣ Chama o service de update
      console.log(id);
      const updatePersonService = new UpdatePersonService();
      const entity = await updatePersonService.execute(id, input);

      const output = PersonOutputMapper.toOutput(entity);

      return res.status(200).json(output); // ✅ status correto
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}
