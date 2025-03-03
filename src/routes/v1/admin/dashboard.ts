import {  Router } from "express";
import * as dashboard from "../../../controllers/v1/admin/dashboard";
import { exitPoint } from '../../../middlewares/exitpoint';
import { entryPoint } from '../../../middlewares/entrypoint';
import { verifyAdmin } from "../../../middlewares/auth";
import passport from "../../../passport/passport";



const router = Router();






/**
 * @swagger
 * /v1/admin/dashboard/get:
 *   post:
 *     tags: 
 *       - admin/dashboard
 *     security:
 *       - adminBearerAuth: []  # Requires a bearer token
 *     summary: Get admin dashboard data (patient count)
 *     description: Retrieves a list of unique patients associated with the authenticated admin based on their appointments.
 *     responses:
 *       200:
 *         description: Successfully retrieved admin dashboard data.
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
 *                       type: number
 *                       example: 5
 *                     totalAppointment:
 *                       type: number
 *                       example: 5
 *                     totalFollowUps:
 *                       type: number
 *                       example: 5
 * 
 */


router.post("/get"
    ,entryPoint,
     passport.authenticate("bearer", { session: false }),
      verifyAdmin,
    dashboard.getDashBoard
    ,exitPoint
);


    export default router;