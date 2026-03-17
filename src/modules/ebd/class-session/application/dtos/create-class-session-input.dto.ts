export type CreateClassSessionInputDto = {
  id_turma: number;
  dt_session: Date | string;
  nr_lesson: number;
  trimester: number;
  topic: string;
  id_teacher: number;
  notes?: string;
  id_person: number;
};
