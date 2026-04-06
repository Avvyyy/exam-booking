import { UserRole } from "../user/types";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterUserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level?: number;
  role: UserRole;
  matricNo?: string;
  department?: string;
  selectedCourseIds?: number[];
}

export interface RegisterCourse {
  courseCodes: string[];
}

export interface AuthUser {
  id: number;
  matricNo?: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// export interface AuthTokenPayload {
//   sub: string;
//   role: UserRole;
//   email: string;
// }

// export interface AuthResponse {
//   token: string;
//   user: AuthUser;
// }
