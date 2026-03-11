"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitReschedulePayment = exports.handleRescheduleAction = exports.performReschedule = exports.getRescheduleRequestById = exports.getAllRescheduleRequests = exports.createRescheduleRequest = void 0;
const reschedule_service_1 = require("../services/reschedule.service");
const createRescheduleRequest = async (req, res) => {
    try {
        const { studentId, courseId, reason } = req.body;
        const result = await (0, reschedule_service_1.postRescheduleRequest)(studentId, courseId, reason);
        return res.status(201).json({
            status: true,
            message: "Reschedule request submitted successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "Failed to submit reschedule request",
        });
    }
};
exports.createRescheduleRequest = createRescheduleRequest;
const getAllRescheduleRequests = async (req, res) => {
    try {
        const requests = await (0, reschedule_service_1.fetchAllRescheduleRequests)();
        res.status(200).json({
            status: true,
            message: "Fetched all reschedule requests",
            data: requests,
        });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};
exports.getAllRescheduleRequests = getAllRescheduleRequests;
const getRescheduleRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || Number.isNaN(Number(id))) {
            return res.status(400).json({
                status: false,
                message: "Invalid reschedule request id",
            });
        }
        const request = await (0, reschedule_service_1.fetchRescheduleRequestById)(Number(id));
        if (!request) {
            return res.status(404).json({
                status: false,
                message: "Reschedule request not found",
            });
        }
        res.status(200).json({
            status: true,
            message: "Reschedule request fetched successfully",
            data: request,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Failed to fetch reschedule request",
        });
    }
};
exports.getRescheduleRequestById = getRescheduleRequestById;
const performReschedule = async (req, res) => {
    try {
        const { studentId, courseId, newSlotId, newBatchId } = req.body;
        const updated = await (0, reschedule_service_1.rescheduleAction)(studentId, courseId, newSlotId, newBatchId);
        res.status(200).json({
            status: true,
            message: "Reschedule completed successfully",
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};
exports.performReschedule = performReschedule;
const handleRescheduleAction = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, adminReason } = req.body; // action = 'accept' | 'reject'
        if (!id || Number.isNaN(Number(id))) {
            return res.status(400).json({
                status: false,
                message: "Invalid reschedule request id",
            });
        }
        if (!["accept", "reject"].includes(action)) {
            return res.status(400).json({
                status: false,
                message: "Invalid action. Must be 'accept' or 'reject'",
            });
        }
        const newStatus = action === "accept" ? "approved" : "rejected";
        const updatedRequest = await (0, reschedule_service_1.updateRescheduleStatus)(Number(id), newStatus, adminReason);
        res.status(200).json({
            status: true,
            message: newStatus === "approved"
                ? "Reschedule request approved"
                : "Reschedule request rejected",
            data: updatedRequest,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Failed to process reschedule action",
        });
    }
};
exports.handleRescheduleAction = handleRescheduleAction;
const submitReschedulePayment = async (req, res) => {
    try {
        const { requestId, paymentRef } = req.body;
        const user = req.user;
        if (!requestId || !paymentRef) {
            return res.status(400).json({
                status: false,
                message: "requestId and paymentRef are required",
            });
        }
        // Verify ownership of the request
        const request = await (0, reschedule_service_1.fetchRescheduleRequestById)(requestId);
        if (!request) {
            return res.status(404).json({
                status: false,
                message: "Reschedule request not found",
            });
        }
        if (request.student_id !== user.id) {
            return res.status(403).json({
                status: false,
                message: "Unauthorized: You can only pay for your own reschedule request",
            });
        }
        // Ensure the request was rejected before allowing payment
        if (request.status !== "rejected") {
            return res.status(400).json({
                status: false,
                message: "Payment can only be submitted for rejected requests",
            });
        }
        // Record payment and mark request as 'paid'
        const updatedRequest = await (0, reschedule_service_1.recordReschedulePayment)(requestId, paymentRef);
        if (!updatedRequest) {
            return res.status(500).json({
                status: false,
                message: "Failed to record payment",
            });
        }
        return res.status(200).json({
            status: true,
            message: "Payment recorded successfully. You can now reschedule your exam.",
            data: updatedRequest,
        });
    }
    catch (error) {
        console.error("Payment submission error:", error);
        return res.status(500).json({
            status: false,
            message: error.message || "An unexpected error occurred",
        });
    }
};
exports.submitReschedulePayment = submitReschedulePayment;
//# sourceMappingURL=reschedule.controller.js.map