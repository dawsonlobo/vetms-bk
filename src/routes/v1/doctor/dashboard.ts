import {  Router } from "express";
import * as dashboard from "../../../controllers/v1/doctor/dashboard";
import { exitPoint } from '../../../middlewares/exitpoint';
import { entryPoint } from '../../../middlewares/entrypoint';
import {authenticateDoctor,verifyDoctor} from '../../../middlewares/auth'
import passport from "../../../passport/passport";



const router = Router();






/**
 * @swagger
 * /v1/doctor/dashboard/get:
 *   post:
 *     tags: 
 *       - doctor/dashboard
 *     security:
 *       - doctorBearerAuth: []  # Requires a bearer token
 *     summary: Get doctor dashboard data (patient count)
 *     description: Retrieves a list of unique patients associated with the authenticated doctor based on their appointments.
 *     responses:
 *       200:
 *         description: Successfully retrieved doctor dashboard data.
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
    authenticateDoctor,verifyDoctor,
    dashboard.getDashBoard
    ,exitPoint
);


    export default router;