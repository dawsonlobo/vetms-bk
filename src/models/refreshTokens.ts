/**
 * @swagger
 * components:
 *   schemas:
 *     refreshToken:
 *       type: object
 *       required:
 *         - userId
 *         - token
 *         - createdAt
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the access token
 *           example: "6512c5f3e4b09a12d8f42b68"
 *         userId:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the user associated with the token
 *           example: "6512c5f3e4b09a12d8f42b69"
 *         token:
 *           type: string
 *           description: JWT or session token for authentication
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the token was created
 *           example: "2024-02-10T12:00:00Z"
 */
