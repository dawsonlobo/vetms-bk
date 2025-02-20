import express from "express";
import { loginController } from "../controllers/auth";

const router = express.Router();
/**
 * @swagger
 * /v1/admin/auth/login:
 *   post:
 *     summary: login
 *     tags: [admin/auth]
 *     security:
 *       - adminBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "alex@example.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
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
 *                     isVerified:
 *                       type: boolean
 *                       example: true
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


router.post("/v1/admin/auth/login", loginController);




/**
 * @swagger
 * /v1/admin/auth/logout:
 *   post:
 *     summary: logout
 *     tags: [admin/auth]
 *     security:
 *       - adminBearerAuth: []
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

/**
 * @swagger
 * /v1/admin/auth/profile:
 *   post:
 *     summary: Get user profile 
 *     tags: [admin/auth]
 *     security:
 *       - adminBearerAuth: []
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
 *                   createdAt:
 *                     type: integer
 *                     example: 1
 *           examples:
 *             example1:
 *               summary: with Projection
 *               value:
 *                 project:
 *                   _id: 1
 *                   createdAt: 1
 *             example2:
 *               summary: without Projection
 *               value:
 *                 project: {}
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
 *                     isVerified:
 *                       type: boolean
 *                       example: true
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
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refresh_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /v1/admin/auth/update:
 *   put:
 *     summary: Update user profile 
 *     tags: [admin/auth]
 *     security:
 *       - adminBearerAuth: []
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
 *               role:
 *                 type: string
 *                 enum: [ADMIN, DOCTOR, RECEPTIONIST, NURSE]
 *                 example: "DOCTOR"
 *               isDeleted:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - name
 *               - email
 *               - role
 *           examples:
 *             fullUpdate:
 *               summary: Full profile update
 *               value:
 *                 name: "Alex"
 *                 email: "alex@example.com"
 *                 role: "DOCTOR"
 *                 isDeleted: false
 *             partialUpdate:
 *               summary: Update only isDeleted status
 *               value:
 *                 isDeleted: true
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


/**
 * @swagger
 * /v1/admin/auth/refresh:
 *   post:
 *     summary: Refresh user token 
 *     tags: [admin/auth]
 *     security:
 *       - adminBearerAuth: []
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
 *                     isVerified:
 *                       type: boolean
 *                       example: true
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
// Refresh Token Route
router.post("/v1/admin/auth/refresh", refreshTokenController);

export default router;