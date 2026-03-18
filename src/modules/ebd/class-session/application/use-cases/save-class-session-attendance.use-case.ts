import { AppError } from '../../../../../shared/errors/AppError';
import {
  ClassSessionAttendanceStudent,
  ClassSessionRepository,
  ClassSessionWithTeacher,
} from '../../domain/repositories/class-session.repository';
import { SaveClassSessionAttendanceInputDto } from '../dtos/save-class-session-attendance-input.dto';

export class SaveClassSessionAttendanceUseCase {
  constructor(private readonly repository: ClassSessionRepository) {}

  async execute(
    id_class_session: number,
    data: SaveClassSessionAttendanceInputDto,
    id_organization?: number | null,
  ): Promise<{ session: ClassSessionWithTeacher; students: ClassSessionAttendanceStudent[] }> {
    if (!id_class_session) {
      throw new AppError('É obrigatório informar a aula', 400);
    }

    const session = await this.repository.findDetailedById(id_class_session, id_organization);
    if (!session) {
      throw new AppError('Aula não encontrada', 404);
    }

    const items = Array.isArray(data?.items) ? data.items : [];
    if (items.length === 0) {
      throw new AppError('É obrigatório informar ao menos um aluno na chamada', 400);
    }

    const duplicatedIds = new Set<number>();
    const seenIds = new Set<number>();

    for (const item of items) {
      if (!item?.id_student) {
        throw new AppError('Todos os alunos da chamada devem ser válidos', 400);
      }

      if (typeof item.is_present !== 'boolean') {
        throw new AppError('A presença de cada aluno deve ser verdadeira ou falsa', 400);
      }

      if (seenIds.has(item.id_student)) {
        duplicatedIds.add(item.id_student);
      }

      seenIds.add(item.id_student);
    }

    if (duplicatedIds.size > 0) {
      throw new AppError('A chamada não pode conter o mesmo aluno repetido', 400);
    }

    const turmaStudents = await this.repository.listAttendanceByClassSession(
      id_class_session,
      id_organization,
    );
    const validStudentIds = new Set(turmaStudents.map((student) => student.id_student));

    for (const item of items) {
      if (!validStudentIds.has(item.id_student)) {
        throw new AppError('Há aluno(s) na chamada que não pertencem mais à turma', 400);
      }
    }

    const students = await this.repository.saveAttendance(
      id_class_session,
      items.map((item) => ({
        id_student: item.id_student,
        is_present: item.is_present,
        notes: item.notes?.trim() || undefined,
      })),
      id_organization,
    );

    const updatedSession = await this.repository.findDetailedById(id_class_session, id_organization);
    if (!updatedSession) {
      throw new AppError('Aula não encontrada', 404);
    }

    return { session: updatedSession, students };
  }
}
