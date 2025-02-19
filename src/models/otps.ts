/**
 * @swagger
 * components:
 *   schemas:
 *     OTP:
 *       type: object
 *       required:
 *         - userId
 *         - email
 *         - phone
 *         - createdAt
 *         - expiresAt
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the OTP record
 *           example: "6512c5f3e4b09a12d8f42b68"
 *         userId:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the user associated with the OTP
 *           example: "6512c5f3e4b09a12d8f42b69"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address associated with the OTP
 *           example: "user@example.com"
 *         phone:
 *           type: string
 *           description: Phone number associated with the OTP
 *           example: "+1234567890"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the OTP was generated
 *           example: "2024-02-10T12:00:00Z"
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the OTP expires
 *           example: "2024-02-10T12:05:00Z"
 */
