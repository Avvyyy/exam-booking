export enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
}

export interface User {
  id: string;
  matricNo?: string;
  fullName: string;
  email: string;
  faculty?: string;
  courseOfStudy?: string;
  department?: string;
  level?: number;
  password: string;
  created_at: Date;
  role: UserRole;
}

export interface StudentOnboardingPayload {
  matricNo: string;
  fullName: string;
  email: string;
  level: number;
  courseOfStudy: string;
  faculty: string;
  password: string;
  selectedCourseIds: number[];
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  matricNo?: string;
  fullName: string;
  email: string;
  role: UserRole;
}
