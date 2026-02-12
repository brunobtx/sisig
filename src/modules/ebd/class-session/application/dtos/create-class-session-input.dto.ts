export type CreateClassSessionInputDto = {
  id_class: number;
  dt_session: Date | string;
  nr_lesson: number;
  topic: string;
  id_teacher: number;
  notes?: string;
  id_person: number;
};
