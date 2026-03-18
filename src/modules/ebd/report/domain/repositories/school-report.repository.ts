export type SchoolAttendanceReportFilters = {
  id_academic_year: number;
  trimester?: number;
  id_turma?: number;
};

export type SchoolAttendanceSummary = {
  total_turmas: number;
  total_students: number;
  total_class_sessions: number;
  total_completed_class_sessions: number;
  total_partial_class_sessions: number;
  total_pending_class_sessions: number;
  total_attendance_records: number;
  total_present: number;
  total_absent: number;
  attendance_rate: number;
};

export type SchoolAttendanceTurmaReport = {
  id_turma: number;
  turma_uuid: string;
  class_name: string;
  academic_year: number;
  total_students: number;
  total_class_sessions: number;
  total_completed_class_sessions: number;
  total_partial_class_sessions: number;
  total_pending_class_sessions: number;
  total_attendance_records: number;
  total_present: number;
  total_absent: number;
  attendance_rate: number;
};

export type SchoolAttendanceStudentReport = {
  id_student: number;
  student_uuid: string;
  name: string;
  email: string;
  cpf: string;
  total_present: number;
  total_absent: number;
  attendance_rate: number;
};

export type SchoolAttendanceReport = {
  summary: SchoolAttendanceSummary;
  turmas: SchoolAttendanceTurmaReport[];
  students: SchoolAttendanceStudentReport[];
};

export interface SchoolReportRepository {
  academicYearExists(id_academic_year: number, id_organization?: number | null): Promise<boolean>;
  turmaExists(id_turma: number, id_organization?: number | null): Promise<boolean>;
  getAttendanceReport(
    filters: SchoolAttendanceReportFilters,
    id_organization?: number | null,
  ): Promise<SchoolAttendanceReport>;
}
