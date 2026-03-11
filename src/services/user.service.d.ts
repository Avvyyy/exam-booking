export declare const authenticateUser: (identifier: string, password: string) => Promise<any>;
export declare const getRegisteredStudents: () => Promise<any[]>;
export declare const fetchUserDetails: (id: number) => Promise<any>;
export declare const fetchStudentExamSchedules: (studentId: number) => Promise<any[]>;
export declare const fetchAvailableSlotsForCourse: (courseId: number) => Promise<any[]>;
export declare const fetchAvailableBatchesForSlot: (slotId: number) => Promise<any[]>;
export declare const selectExamBatch: (studentId: number, courseId: number, batchId: number, mode?: "physical" | "online") => Promise<{
    success: boolean;
    seatNumber: number;
    batchId: number;
    scheduledTime: any;
}>;
export declare const changeExamSlot: (studentId: number, courseId: number, newSlotId: number, newSeatNumber: number) => Promise<{
    success: boolean;
}>;
//# sourceMappingURL=user.service.d.ts.map