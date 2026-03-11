"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleStudent = exports.getUserDetails = exports.createExamSlot = exports.createCourse = void 0;
const admin_service_1 = require("../services/admin.service");
const user_service_1 = require("../services/user.service");
const createCourse = async (req, res) => {
    const { code, title, level } = req.body;
    if (!code || !title) {
        return res.status(400).json({
            status: false,
            message: "Course code and title are required",
        });
    }
    try {
        const course = await (0, admin_service_1.createCourseService)(code, title, level);
        res.status(201).json({
            status: true,
            message: "Course created successfully",
            data: course,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Failed to create course",
        });
    }
};
exports.createCourse = createCourse;
/**
 * Admin: Create exam slot and auto-generate batches
 */
const createExamSlot = async (req, res) => {
    const { courseId, startDate, endDate, physicalCapacity } = req.body;
    try {
        const slot = await (0, admin_service_1.createExamSlotWithBatches)(Number(courseId), new Date(startDate), new Date(endDate), physicalCapacity);
        res.status(201).json({
            status: true,
            message: "Exam slot and batches created successfully",
            data: slot,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Failed to create exam slot",
        });
    }
};
exports.createExamSlot = createExamSlot;
// Get user details
const getUserDetails = async (req, res) => {
    const rawId = req.params.studentId;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) {
        return res.status(400).json({
            status: false,
            message: "User ID is required",
            data: {},
        });
    }
    try {
        const user = await (0, user_service_1.fetchUserDetails)(parseInt(id, 10));
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User not found",
                data: {},
            });
        }
        return res.status(200).json({
            status: true,
            message: "User details retrieved successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Get User Details Error:", error);
        return res.status(400).json({
            status: false,
            message: error.message || "Failed to retrieve details",
            data: {},
        });
    }
};
exports.getUserDetails = getUserDetails;
/**
 * Admin: Reschedule a student's exam
 */
const rescheduleStudent = async (req, res) => {
    const { studentId, courseId, newSlotId, newBatchId } = req.body;
    if (!studentId || !courseId || !newSlotId || !newBatchId) {
        return res.status(400).json({
            status: false,
            message: "All fields are required",
        });
    }
    try {
        const updated = await (0, admin_service_1.adminRescheduleStudent)(parseInt(studentId), parseInt(courseId), 
        // parseInt(newSlotId),
        parseInt(newBatchId));
        res.status(200).json({
            status: true,
            message: "Student rescheduled successfully",
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Failed to reschedule student",
        });
    }
};
exports.rescheduleStudent = rescheduleStudent;
//# sourceMappingURL=admin.controller.js.map