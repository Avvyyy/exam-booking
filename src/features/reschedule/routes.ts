import { Router } from "express";
import {
  completeRescheduleFunc,
  createRescheduleRequestFunc,
  listRescheduleRequestsFunc,
  processRescheduleRequestFunc,
  recordReschedulePaymentFunc,
} from "./controller";
import { requireAuth } from "../../middleware/auth";
import { UserRole } from "../user/types";

const rescheduleRoutes = Router();

rescheduleRoutes.post("/requests", requireAuth([UserRole.STUDENT]), createRescheduleRequestFunc);
rescheduleRoutes.post(
  "/requests/:requestId/process",
  requireAuth([UserRole.ADMIN]),
  processRescheduleRequestFunc
);
rescheduleRoutes.post(
  "/requests/:requestId/payment",
  requireAuth([UserRole.STUDENT]),
  recordReschedulePaymentFunc
);
rescheduleRoutes.post(
  "/requests/:requestId/complete",
  requireAuth([UserRole.STUDENT]),
  completeRescheduleFunc
);
rescheduleRoutes.get("/requests", requireAuth([UserRole.ADMIN]), listRescheduleRequestsFunc);

export default rescheduleRoutes;

/**
 * @openapi
 * /reschedule/requests:
 *   post:
 *     tags: [Reschedule]
 *     summary: Submit reschedule request with reason after missing/late exam
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId]
 *             properties:
 *               courseId:
 *                 type: integer
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created
 */

/**
 * @openapi
 * /reschedule/requests/{requestId}/process:
 *   post:
 *     tags: [Reschedule]
 *     summary: Admin accepts or rejects reschedule request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, reject]
 *               adminReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request processed
 */

/**
 * @openapi
 * /reschedule/requests/{requestId}/payment:
 *   post:
 *     tags: [Reschedule]
 *     summary: Record student payment after request rejection
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentRef]
 *             properties:
 *               paymentRef:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment recorded
 */

/**
 * @openapi
 * /reschedule/requests/{requestId}/complete:
 *   post:
 *     tags: [Reschedule]
 *     summary: Student finalizes reschedule by selecting a new slot after approval/payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slotId, batchId, mode]
 *             properties:
 *               slotId:
 *                 type: integer
 *               batchId:
 *                 type: integer
 *               mode:
 *                 type: string
 *                 enum: [physical, online]
 *     responses:
 *       200:
 *         description: Reschedule completed
 */

/**
 * @openapi
 * /reschedule/requests:
 *   get:
 *     tags: [Reschedule]
 *     summary: Admin views all reschedule requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Requests returned
 */
