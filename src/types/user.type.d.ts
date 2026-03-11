export declare enum UserRole {
    STUDENT = "student",
    ADMIN = "admin"
}
export interface User {
    id: string;
    matricNo?: string;
    fullName: string;
    email: string;
    department?: string;
    level?: number;
    password: string;
    created_at: Date;
    role: UserRole;
}
//# sourceMappingURL=user.type.d.ts.map