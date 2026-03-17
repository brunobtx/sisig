export type SaveClassSessionAttendanceInputDto = {
  items: Array<{
    id_student: number;
    is_present: boolean;
    notes?: string;
  }>;
};
