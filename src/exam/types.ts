export enum ExamTimeline {
  PAST = "past",
  INCOMING = "incoming",
  MISSED = "missed",
}

export type ExamMode = "physical" | "online";

export interface Course {
  id: number;
  code: string;
  title: string;
  level: number;
}

export interface ExamSlot {
  id: number;
  courseId: number;
  startDate: Date | string;
  endDate: Date | string;
  physicalCapacity: number;
  onlineCapacity?: number;
}

export interface ExamBatch {
  id: number;
  slotId: number;
  batchNumber: number;
  startTime: Date | string;
  endTime: Date | string;
  capacity: number;
  availableSeats?: number;
}

export interface StudentExamSchedule {
  id: number;
  studentId: number;
  courseId: number;
  slotId: number;
  batchId?: number;
  seatNumber?: number;
  mode: ExamMode;
  rescheduled: boolean;
  createdAt: Date | string;
  timeline: ExamTimeline;
}

export interface StudentDashboard {
  studentName: string;
  schedules: StudentExamSchedule[];
}

export interface UpcomingExamOverview {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  slotId: number;
  startDate: Date | string;
  endDate: Date | string;
  registeredStudents: number;
}

export interface AdminDashboardSummary {
  upcomingExams: UpcomingExamOverview[];
  totalRescheduleRequests: number;
}
