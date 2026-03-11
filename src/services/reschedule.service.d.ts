export declare const postRescheduleRequest: (studentId: number, courseId: number, reason?: string) => Promise<any>;
export declare const fetchAllRescheduleRequests: () => Promise<any[]>;
export declare const fetchRescheduleRequestById: (id: number) => Promise<any>;
export declare const updateRescheduleStatus: (id: number, status: "approved" | "rejected", adminReason?: string) => Promise<any>;
export declare const rescheduleAction: (studentId: number, courseId: number, newSlotId: number, newBatchId: number) => Promise<any>;
export declare const recordReschedulePayment: (requestId: number, paymentRef: string) => Promise<any>;
//# sourceMappingURL=reschedule.service.d.ts.map