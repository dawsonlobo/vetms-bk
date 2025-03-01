"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var doctor = require("../../../controllers/v1/doctor/auth");
var exitpoint_1 = require("../../../middlewares/exitpoint");
var entrypoint_1 = require("../../../middlewares/entrypoint");
var auth_1 = require("../../../middlewares/auth");
var passport_1 = require("../../../passport/passport");
var router = (0, express_1.Router)();
/**
 * @swagger
 * /v1/doctor/auth/login:
 *   post:
 *     summary: login
 *     tags: [doctor/auth]
 *     security:
 *       - doctorBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "password@example.com"
 *               password:
 *                 type: string
 *                 example: "Doctor@123"
 *           example:
 *              email: "password@example.com"
 *              password: "password"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6512c5f3e4b09a12d8f42b68"
 *                     name:
 *                       type: string
 *                       example: "Alex"
 *                     email:
 *                       type: string
 *                       example: "alex@example.com"
 *                     role:
 *                       type: string
 *                       example: "ADMIN"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-06T15:30:00Z"
 *                     access_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refresh_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     tokenExpiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-15T12:57:10.956Z"
 *                 toastMessage:
 *                   type: string
 *                   example: "Login successful"
 */
router.post("/doctor/auth/login", entrypoint_1.entryPoint, doctor.loginController, exitpoint_1.exitPoint);
/**
 * @swagger
 * /v1/doctor/auth/logout:
 *   post:
 *     summary: logout
 *     tags: [doctor/auth]
 *     security:
 *       - doctorBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: string
 *                   example: "Admin logged out successfully"
 *                 toastMessage:
 *                   type: string
 *                   example: "Admin logged out successfully"
 */
router.post("/doctor/auth/logout", entrypoint_1.entryPoint, auth_1.authenticateDoctor, auth_1.verifyDoctor, doctor.logoutController, exitpoint_1.exitPoint);
/**
 * @swagger
 * /v1/doctor/auth/profile:
 *   post:
 *     summary: Get user profile
 *     tags: [doctor/auth]
 *     security:
 *       - doctorBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project:
 *                 type: object
 *                 description: Projection fields (optional)
 *                 properties:
 *                   _id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: integer
 *                     example: 1
 *                   email:
 *                     type: integer
 *                     example: 1
 *                   role:
 *                     type: integer
 *                     example: 1
 *                   isVerified:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: integer
 *                     example: 1
 *                   updatedAt:
 *                     type: integer
 *                     example: 1
 *           examples:
 *             fullProjection:
 *               summary: Full data projection (Retrieve all fields)
 *               value:
 *                 project:
 *                   _id: 1
 *                   name: 1
 *                   email: 1
 *                   role: 1
 *                   createdAt: 1
 *                   updatedAt: 1
 *             limitedProjection:
 *               summary: Limited data projection (Retrieve only _id and createdAt)
 *               value:
 *                 project:
 *                   _id: 1
 *                   createdAt: 1
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6512c5f3e4b09a12d8f42b68"
 *                     name:
 *                       type: string
 *                       example: "Admin User"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *                     role:
 *                       type: string
 *                       example: "ADMIN"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-05T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-06T15:30:00Z"
 *             examples:
 *               fullResponse:
 *                 summary: Full response (all fields)
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "6512c5f3e4b09a12d8f42b68"
 *                     name: "Admin User"
 *                     email: "admin@example.com"
 *                     role: "ADMIN"
 *                     createdAt: "2024-02-05T12:00:00Z"
 *                     updatedAt: "2024-02-06T15:30:00Z"
 *               limitedResponse:
 *                 summary: Limited response (only _id and createdAt)
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "6512c5f3e4b09a12d8f42b68"
 *                     createdAt: "2024-02-05T12:00:00Z"
 */
// router.post("/doctor/auth/profile",entryPoint,authenticateDoctor,verifyDoctor,doctor.getDoctorProfile,exitPoint);
router.post("/doctor/auth/profile", entrypoint_1.entryPoint, passport_1.default.authenticate("bearer", { session: false }), auth_1.verifyDoctor, doctor.getDoctorProfile, exitpoint_1.exitPoint);
/**
 * @swagger
 * /v1/doctor/auth/update/:
 *   put:
 *     summary: Update user profile
 *     tags: [doctor/auth]
 *     security:
 *       - doctorBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Alex"
 *               email:
 *                 type: string
 *                 example: "alex@example.com"
 *           examples:
 *             fullUpdate:
 *               summary: Full profile update
 *               value:
 *                 name: "Alex"
 *                 email: "alex@example.com"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: string
 *                   example: "Updated successfully"
 *                 toastMessage:
 *                   type: string
 *                   example: "Updated successfully"
 */
router.put("/doctor/auth/update", entrypoint_1.entryPoint, auth_1.authenticateDoctor, auth_1.verifyDoctor, doctor.updateDoctorProfile, exitpoint_1.exitPoint);
/**
 * @swagger
 * /v1/doctor/auth/refresh:
 *   post:
 *     summary: Refresh user token
 *     tags: [doctor/auth]
 *     security:
 *       - doctorBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9.eyJpYXQiOjE3MTg0NTYyMzEsImV4cCI6MjAzMzgxNjIzMX0.Po_Xc3McuJt4GhKWpd1B5cUcHsdZWq_4ElO138VmsU"
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6512c5f3e4b09a12d8f42b68"
 *                     name:
 *                       type: string
 *                       example: "Admin User"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *                     role:
 *                       type: string
 *                       example: "ADMIN"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-05T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-06T15:30:00Z"
 *                     access_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9..."
 *                     refresh_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9..."
 *                     tokenExpiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-15T12:57:10.956Z"
 */
router.post("/doctor/auth/refresh", entrypoint_1.entryPoint, auth_1.authenticateDoctor, auth_1.verifyDoctor, doctor.refreshTokenController, exitpoint_1.exitPoint);
exports.default = router;
