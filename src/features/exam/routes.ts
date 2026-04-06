import { Router } from "express";
import {
  adminDashboardFunc,
  createCourseFunc,
  examBatchStudentCountFunc,
  rescheduleExamFunc,
  scheduleExamFunc,
  selectExamSlotFunc,
} from "./controller";
import { requireAuth } from "../../middleware/auth";
import { UserRole } from "../user/types";

const examRoutes = Router();

examRoutes.post("/courses", requireAuth([UserRole.ADMIN]), createCourseFunc);
examRoutes.post("/schedule", requireAuth([UserRole.ADMIN]), scheduleExamFunc);
examRoutes.put("/reschedule", requireAuth([UserRole.ADMIN]), rescheduleExamFunc);
examRoutes.get("/dashboard/admin", requireAuth([UserRole.ADMIN]), adminDashboardFunc);
examRoutes.post("/slots/select", requireAuth([UserRole.STUDENT]), selectExamSlotFunc);
examRoutes.get(
  "/batches/:batchId/students/count",
  requireAuth([UserRole.ADMIN]),
  examBatchStudentCountFunc
);

export default examRoutes;

/**
 * @openapi
 * /exams/courses:
 *   post:
 *     tags: [Exams]
 *     summary: Create a new course (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, title]
 *             properties:
 *               code:
 *                 type: string
 *               title:
 *                 type: string
 *               level:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Course created
 */

/**
 * @openapi
 * /exams/schedule:
 *   post:
 *     tags: [Exams]
 *     summary: Schedule exam datetime and split into batches (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId, startDate, endDate, physicalCapacity]
 *             properties:
 *               courseId:
 *                 type: integer
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               physicalCapacity:
 *                 type: integer
 *               onlineCapacity:
 *                 type: integer
 *               batchDurationMinutes:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Exam scheduled
 */

/**
 * @openapi
 * /exams/reschedule:
 *   put:
 *     tags: [Exams]
 *     summary: Reschedule a course exam slot (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slotId, newStartDate, newEndDate]
 *             properties:
 *               slotId:
 *                 type: integer
 *               newStartDate:
 *                 type: string
 *                 format: date-time
 *               newEndDate:
 *                 type: string
 *                 format: date-time
 *               batchDurationMinutes:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Exam rescheduled
 */

/**
 * @openapi
 * /exams/dashboard/admin:
 *   get:
 *     tags: [Exams]
 *     summary: View admin dashboard summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary returned
 */

/**
 * @openapi
 * /exams/slots/select:
 *   post:
 *     tags: [Exams]
 *     summary: Student chooses a time slot batch for an exam
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId, slotId, batchId, mode]
 *             properties:
 *               courseId:
 *                 type: integer
 *               slotId:
 *                 type: integer
 *               batchId:
 *                 type: integer
 *               mode:
 *                 type: string
 *                 enum: [physical, online]
 *     responses:
 *       200:
 *         description: Slot selected
 */

/**
 * @openapi
 * /exams/batches/{batchId}/students/count:
 *   get:
 *     tags: [Exams]
 *     summary: Calculate number of students in an exam batch (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Batch count returned
 */
