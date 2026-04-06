import { Router } from "express";
import {
  listCoursesFunc,
  studentDashboardFunc,
  studentOnboardingFunc,
} from "./controller";
import { requireAuth } from "../../middleware/auth";
import { UserRole } from "./types";

const userRoutes = Router();

userRoutes.get("/courses", listCoursesFunc);
userRoutes.post("/onboarding", studentOnboardingFunc);
userRoutes.get("/dashboard", requireAuth([UserRole.STUDENT]), studentDashboardFunc);

export default userRoutes;

/**
 * @openapi
 * /users/courses:
 *   get:
 *     tags: [Users]
 *     summary: List predefined courses for student onboarding
 *     responses:
 *       200:
 *         description: Course list returned
 */

/**
 * @openapi
 * /users/onboarding:
 *   post:
 *     tags: [Users]
 *     summary: Complete student onboarding and course selection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentOnboardingRequest'
 *     responses:
 *       201:
 *         description: Student onboarded
 */

/**
 * @openapi
 * /users/dashboard:
 *   get:
 *     tags: [Users]
 *     summary: Get student dashboard (past/incoming/missed exams)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard returned
 *       401:
 *         description: Unauthorized
 */
