"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickExamBatch = exports.getAvailableBatches = exports.getAvailableSlotsForCourse = exports.getUserExamSchedules = exports.getUserDetails = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const user_service_1 = require("../services/user.service");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
// Get details of authenticated user
const getUserDetails = async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(400).json({
            status: false,
            message: "User ID is required",
            data: {},
        });
    }
    try {
        const user = await (0, user_service_1.fetchUserDetails)(parseInt(id));
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
// Get exam schedules for a student
const getUserExamSchedules = async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(400).json({
            status: false,
            message: "Student ID is required",
            data: {},
        });
    }
    try {
        const schedules = await (0, user_service_1.fetchStudentExamSchedules)(parseInt(id));
        return res.status(200).json({
            status: true,
            message: "Exam schedules retrieved successfully",
            data: schedules,
        });
    }
    catch (error) {
        console.error("GetUserExamSchedules Error:", error);
        return res.status(400).json({
            status: false,
            message: error.message || "Failed to retrieve exam schedules",
            data: {},
        });
    }
};
exports.getUserExamSchedules = getUserExamSchedules;
// Get available slots for a course
const getAvailableSlotsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const parsedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;
    if (!parsedCourseId) {
        return res.status(400).json({
            status: false,
            message: "Course id is required",
            data: {},
        });
    }
    try {
        const slots = await (0, user_service_1.fetchAvailableSlotsForCourse)(parseInt(parsedCourseId, 10));
        return res.status(200).json({
            status: true,
            message: "Available slots retrieved successfully",
            data: slots,
        });
    }
    catch (error) {
        console.error("GetAvailableSlots Error:", error);
        return res.status(500).json({
            status: false,
            message: error.message || "Failed to retrieve slots",
            data: {},
        });
    }
};
exports.getAvailableSlotsForCourse = getAvailableSlotsForCourse;
const getAvailableBatches = async (req, res) => {
    const { slotId } = req.params;
    const parsedSlotId = Array.isArray(slotId) ? slotId[0] : slotId;
    if (!parsedSlotId) {
        return res.status(400).json({
            status: false,
            message: "slotId parameter is required",
            data: {},
        });
    }
    try {
        const batches = await (0, user_service_1.fetchAvailableBatchesForSlot)(parseInt(parsedSlotId, 10));
        const formatted = batches.map((b) => ({
            ...b,
            start_time: dayjs_1.default.utc(b.start_time).tz("Africa/Lagos").format("YYYY-MM-DD HH:mm:ss"),
            end_time: dayjs_1.default.utc(b.end_time).tz("Africa/Lagos").format("YYYY-MM-DD HH:mm:ss"),
        }));
        return res.status(200).json({
            status: true,
            message: "Available batches retrieved successfully",
            data: formatted,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "Failed to fetch batches",
            data: {},
        });
    }
};
exports.getAvailableBatches = getAvailableBatches;
// Pick Exam Batch Controller
const pickExamBatch = async (req, res) => {
    const { id } = req.user;
    const { courseId, batchId, mode = "physical" } = req.body;
    if (!id || !courseId || !batchId) {
        return res.status(400).json({
            status: false,
            message: "Student ID, Course ID and batchId are required",
            data: {},
        });
    }
    try {
        const schedule = await (0, user_service_1.selectExamBatch)(parseInt(id), parseInt(courseId), parseInt(batchId), mode);
        return res.status(201).json({
            status: true,
            message: "Batch selected successfully",
            data: schedule,
        });
    }
    catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message || "Failed to pick batch",
            data: {},
        });
    }
};
exports.pickExamBatch = pickExamBatch;
//# sourceMappingURL=student.controller.js.map