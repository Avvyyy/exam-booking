export enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
}

export interface User {
  id: number;
  matricNo?: string;
  fullName: string;
  email: string;
  department?: string;
  level?: number;
  createdAt: Date;
  role: UserRole;
}

export interface StudentOnboardingPayload {
  matricNo: string;
  firstName: string;
  lastName: string;
  email: string;
  level: number;
  department: string;
  password: string;
  selectedCourseIds: number[];
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  matricNo?: string;
  fullName: string;
  email: string;
  role: UserRole;
}
