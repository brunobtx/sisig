export type CreateClassInputDto = {
  name: string;
  idade_in: number;
  idade_fn: number;
  isActive: boolean;
  academicYearId?: number | null;
  description?: string;
};
