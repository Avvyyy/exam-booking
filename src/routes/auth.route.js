"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const user_validations_1 = require("../validations/user.validations");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     description: Authenticates a user using email or matric number and password, and returns a JWT token with user info.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email or matric number
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token to use for authenticated requests
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       description: Authenticated user object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "12345"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         role:
 *                           type: string
 *                           example: "student"
 *       400:
 *         description: Missing identifier or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email/Matric number and password are required"
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *                 data:
 *                   type: object
 *                   example: {}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unable to login"
 *                 data:
 *                   type: object
 *                   example: {}
 */
authRoutes.post('/login', (0, validation_middleware_1.validateSchema)(user_validations_1.loginSchema), auth_controller_1.loginUser);
//# sourceMappingURL=auth.route.js.map