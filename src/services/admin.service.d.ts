export declare const createExamSlotWithBatches: (courseId: number, startDate: Date, endDate: Date, physicalCapacity: number, batchDurationMinutes?: number, breakStartHour?: number, breakEndHour?: number, batchGapMinutes?: number) => Promise<{
    slotId: number;
    batchCount: number;
    action: "created" | "updated";
}>;
export declare const createCourseService: (code: string, title: string, level: number) => Promise<any>;
/**
 * Admin reschedules a student's exam to a new slot and batch
 */
export declare const adminRescheduleStudent: (studentId: number, courseId: number, newBatchId: number) => Promise<{
    action: string;
    schedule: any;
}>;
//# sourceMappingURL=admin.service.d.ts.map