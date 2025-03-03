import express from "express";
import { getNurseDashboard } from "../../../controllers/v1/nurse/dashboard";
import { verifyNurse } from "../../../middlewares/auth";
import { entryPoint } from "../../../middlewares/entrypoint";
import { exitPoint } from "../../../middlewares/exitpoint";
import passport from "passport";

const router = express.Router();
/**
 * @swagger
 * /v1/nurse/dashboard:
 *   post:
 *     tags: 
 *       - nurse/dashboard
 *     security:
 *       - nurseBearerAuth: []  # Requires a bearer token
 *     summary: Get nurse dashboard data (total patients count)
 *     description: Retrieves the total number of unique patients associated with the authenticated nurse.
 *     responses:
 *       200:
 *         description: Successfully retrieved total patient count.
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalPatients:
 *                       type: integer
 *                       example: 5
 */


router.post(
    "/dashboard",entryPoint, 
    passport.authenticate("bearer", { session: false }),
    verifyNurse,  // Ensure the authenticated user is a nurse
    getNurseDashboard,
    exitPoint     // Optional middleware for logging
);

export default router;
