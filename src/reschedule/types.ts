export enum RescheduleRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PAID = "paid",
  COMPLETED = "completed",
}

export type RescheduleAction = "accept" | "reject";

export enum PaymentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  FAILED = "failed",
}

export interface RescheduleRequest {
  id: number;
  studentId: number;
  courseId: number;
  reason?: string;
  adminReason?: string;
  status: RescheduleRequestStatus;
  paymentRef?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface CreateRescheduleRequestBody {
  studentId: number;
  courseId: number;
  reason?: string;
}

export interface ProcessRescheduleRequestBody {
  action: RescheduleAction;
  adminReason?: string;
}

export interface RecordReschedulePaymentBody {
  requestId: number;
  paymentRef: string;
}
