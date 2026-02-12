export type CreateAcademicPeriodInputDto = {
  id_academy_year: number;
  name: string;
  dt_start: Date | string;
  dt_end: Date | string;
  id_person_create: number;
};
