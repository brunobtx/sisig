import { AppError } from '../../../../../shared/errors/AppError';
import {
  ClassSessionAttendanceStudent,
  ClassSessionRepository,
  ClassSessionWithTeacher,
} from '../../domain/repositories/class-session.repository';

export class GetClassSessionAttendanceUseCase {
  constructor(private readonly repository: ClassSessionRepository) {}

  async execute(
    id_class_session: number,
  ): Promise<{ session: ClassSessionWithTeacher; students: ClassSessionAttendanceStudent[] }> {
    if (!id_class_session) {
      throw new AppError('É obrigatório informar a aula', 400);
    }

    const session = await this.repository.findDetailedById(id_class_session);
    if (!session) {
      throw new AppError('Aula não encontrada', 404);
    }

    const students = await this.repository.listAttendanceByClassSession(id_class_session);
    return { session, students };
  }
}
