export type CreateLessonInputDto = {
  id_turma: number;
  dt_lesson: Date | string;
  nr_lesson: number;
  title: string;
  description?: string;
  id_period: number;
  id_person_create: number;
};
