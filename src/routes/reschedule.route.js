"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const reschedule_controller_1 = require("../controllers/reschedule.controller");
const rescheduleRoutes = (0, express_1.Router)();
exports.rescheduleRoutes = rescheduleRoutes;
// Student creates a reschedule request
rescheduleRoutes.post("/request", auth_middleware_1.verifyToken, (0, auth_middleware_1.verifyRole)("student"), reschedule_controller_1.createRescheduleRequest);
// Student performs the actual rescheduling (after approval or payment)
rescheduleRoutes.post("/", auth_middleware_1.verifyToken, (0, auth_middleware_1.verifyRole)("student"), reschedule_controller_1.performReschedule);
// Student submits payment proof for rejected reschedule
rescheduleRoutes.post("/payment", auth_middleware_1.verifyToken, (0, auth_middleware_1.verifyRole)("student"), reschedule_controller_1.submitReschedulePayment);
// Admin views all reschedule requests
rescheduleRoutes.get("/requests", auth_middleware_1.verifyToken, (0, auth_middleware_1.verifyRole)("admin"), reschedule_controller_1.getAllRescheduleRequests);
// Admin views details of a single reschedule request
rescheduleRoutes.get("/request/:id", auth_middleware_1.verifyToken, (0, auth_middleware_1.verifyRole)("admin"), reschedule_controller_1.getRescheduleRequestById);
// Admin accepts or rejects a reschedule request
rescheduleRoutes.patch("/request/action/:id", auth_middleware_1.verifyToken, (0, auth_middleware_1.verifyRole)("admin"), reschedule_controller_1.handleRescheduleAction);
//# sourceMappingURL=reschedule.route.js.map