import { Router } from "express";
import passport from "../../../passport/passport";
import * as auth from "../../../controllers/v1/admin/auth"
import { entryPoint } from "../../../middlewares/entrypoint";
import { exitPoint } from "../../../middlewares/exitpoint";
const router = Router();
import { verifyAdmin } from "../../../middlewares/auth";

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
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-06T15:30:00Z"
 *                     access_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9..."
 *                     refresh_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9..."
 *                     tokenExpiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-15T12:57:10.956Z"
 *                 toastMessage:
 *                   type: string
 *                   example: "Login successful"
 */


router.post("/admin/auth/login",entryPoint, auth.loginController,exitPoint);




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
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9..."
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


router.post("/admin/auth/logout", entryPoint,passport.authenticate("bearer", { session: false }),verifyAdmin,auth.logoutController,exitPoint);
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
 *                   access_token:
 *                     type: integer
 *                     example: 1
 *                   refresh_token:
 *                     type: integer
 *                     example: 1
 *                   tokenExpiresAt:
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
 *                   access_token: 1
 *                   refresh_token: 1
 *                   tokenExpiresAt: 1
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
 *                     access_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9..."
 *                     refresh_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9..."
 *                     tokenExpiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-07T18:00:00Z"
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
 *                     access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9..."
 *                     refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9..."
 *                     tokenExpiresAt: "2024-02-07T18:00:00Z"
 *               limitedResponse:
 *                 summary: Limited response (only _id and createdAt)
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "6512c5f3e4b09a12d8f42b68"
 *                     createdAt: "2024-02-05T12:00:00Z"
 */


router.post("/admin/auth/profile", entryPoint,passport.authenticate("bearer", { session: false }),verifyAdmin, auth.getAdminProfile,exitPoint);

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
 *                 example: "ADMIN"
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
router.put("/admin/auth/update",entryPoint,passport.authenticate("bearer", { session: false }),verifyAdmin, auth.updateAdminProfile,exitPoint);

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



router.post("/admin/auth/refresh",entryPoint,passport.authenticate("bearer", { session: false }),verifyAdmin, auth.refreshTokenController,exitPoint);

export default router;