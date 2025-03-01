import { Router } from "express";
import { getAll, getOne } from "../../../controllers/v1/admin/appointments";
import { exitPoint } from "../../../middlewares/exitpoint";
import { entryPoint } from "../../../middlewares/entrypoint";
import { verifyAdmin } from "../../../middlewares/auth";
import passport from "../../../passport/passport";

const router = Router();

/**
 * @swagger
 * /v1/admin/appointments/getAll:
 *   post:
 *     tags:
 *       - admin/appointments
 *     security:
 *       - adminBearerAuth: []
 *     summary: Get all
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include in the response (projection)
 *               filter:
 *                 type: object
 *                 description: Filters to apply when retrieving appointments
 *               options:
 *                 type: object
 *                 description: Options for pagination and sorting
 *               pagination:
 *                 type: object
 *                 description: Pagination settings for the response
 *               search:
 *                 type: array
 *                 description: Search settings for the request
 *                 items:
 *                   type: object
 *               date:
 *                 type: integer
 *                 description: The specific date in Unix timestamp format
 *               fromDate:
 *                 type: integer
 *                 description: The starting date in Unix timestamp format
 *               toDate:
 *                 type: integer
 *                 description: The ending date in Unix timestamp format
 *           examples:
 *             projectionExample:
 *               summary: Projection Example
 *               value:
 *                 projection:
 *                   _id: 1
 *                   patientId: 1
 *                   doctorId: 1
 *                   date: 1
 *                   schedule: 1
 *                   createdAt: 1
 *                   updatedAt: 1
 *             filterExample:
 *               summary: Filter Example
 *               value:
 *                 filter:
 *                   doctorId: "66b3279c39c21f7342c13333"
 *                   schedule: "SCHEDULED"
 *                   petId: { "$in": ["66b3279c39c21f7342c12222", "66b3279c39c21f7342c14444"] }
 *             singleDateExample:
 *               summary: Multi-date Example
 *               value:
 *                 date: 1738658701
 *             multiDateExample:
 *               summary: Single-date Example
 *               value:
 *                 fromDate: 1707036301
 *                 toDate: 1738658701
 *             pagination:
 *               summary: Pagination Example
 *               value:
 *                 options:
 *                   page: 1
 *                   itemsPerPage: 10
 *             sortExample:
 *               summary: Sort Example
 *               value:
 *                 options:
 *                   sortBy:
 *                     - "createdAt"
 *                   sortDesc:
 *                     - true
 *             searchExample:
 *               summary: Search Example
 *               value:
 *                 search:
 *                   - term: "SCHEDULED"
 *                     fields: ["schedule"]
 *                     startsWith: true
 *                     endsWith: false
 *     responses:
 *       200:
 *         description: Get all appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 status:
 *                   type: "integer"
 *                   format: "int64"
 *                 message:
 *                   type: "string"
 *                 data:
 *                   type: "object"
 *                   properties:
 *                     totalCount:
 *                       type: "integer"
 *                       description: Total number of appointments
 *                     tableData:
 *                       type: "array"
 *                       items:
 *                         type: "object"
 *                         properties:
 *                           _id:
 *                             type: "string"
 *                             description: The unique ID of the appointment
 *                           patientId:
 *                             type: "string"
 *                             description: The ID of the pet
 *                           doctorId:
 *                             type: "string"
 *                             description: The ID of the doctor
 *                           date:
 *                             type: "string"
 *                             format: "date-time"
 *                             description: The date and time of the appointment
 *                           schedule:
 *                             type: "string"
 *                             enum: ["SCHEDULED", "COMPLETED", "CANCELLED"]
 *                             description: The current status of the appointment
 *                           createdAt:
 *                             type: "string"
 *                             format: "date-time"
 *                             description: Timestamp when the appointment was created
 *                           updatedAt:
 *                             type: "string"
 *                             format: "date-time"
 *                             description: Timestamp when the appointment was last updated
 *             examples:
 *               example1:
 *                 summary: "Successful response with data"
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     totalCount: 2
 *                     tableData:
 *                     -   _id: "66b3279c39c21f7342c125b4"
 *                         patientId: "66b3279c39c21f7342c12222"
 *                         doctorId: "66b3279c39c21f7342c13333"
 *                         date: "2025-02-01T08:00:00Z"
 *                         schedule: "SCHEDULED"
 *                         createdAt: "2025-02-01T08:00:00Z"
 *                         updatedAt: "2025-02-01T08:00:00Z"
 *                     -   _id: "66b3279c39c21f7342c1520n"
 *                         patientId: "66b3279c39c21f7342c14444"
 *                         doctorId: "66b3279c39c21f7342c15555"
 *                         date: "2025-02-02T10:30:00Z"
 *                         schedule: "COMPLETED"
 *                         createdAt: "2025-02-02T08:00:00Z"
 *                         updatedAt: "2025-02-02T08:00:00Z"
 */

router.post(
  "/getAll",
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyAdmin,
  getAll,
  exitPoint,
);

/**
 * @swagger
 * /v1/admin/appointments/getOne/{id}:
 *   post:
 *     tags:
 *       - admin/appointments
 *     security:
 *       - adminBearerAuth: []
 *     summary: Get one
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the appointment to retrieve
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project:
 *                 type: object
 *                 description: Fields to include or exclude in the response
 *           examples:
 *             projectionExample:
 *               summary: Example with projection
 *               value:
 *                 project:
 *                   _id: 1
 *                   patientId: 1
 *                   doctorId: 1
 *                   date: 1
 *                   schedule: 1
 *                   createdAt: 1
 *                   updatedAt: 1
 *     responses:
 *       200:
 *         description: Get one appointment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   format: int64
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the appointment
 *                     patientId:
 *                       type: string
 *                       description: The ID of the pet associated with the appointment
 *                     doctorId:
 *                       type: string
 *                       description: The ID of the doctor assigned to the appointment
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time of the appointment
 *                     schedule:
 *                       type: string
 *                       enum: ["SCHEDULED", "COMPLETED", "CANCELLED"]
 *                       description: The status of the appointment
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the appointment was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the appointment was last updated
 *             examples:
 *               get-one-appointment:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "66b3279c39c21f7342c1520a"
 *                     patientId: "66b3279c39c21f7342c1520p"
 *                     doctorId: "66b3279c39c21f7342c1520d"
 *                     date: "2025-02-19T10:00:00Z"
 *                     schedule: "SCHEDULED"
 *                     createdAt: "2025-02-01T08:00:00Z"
 *                     updatedAt: "2025-02-01T08:00:00Z"
 */

router.post(
  "/getOne/:id",
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyAdmin,
  getOne,
  exitPoint,
);

export default router;
