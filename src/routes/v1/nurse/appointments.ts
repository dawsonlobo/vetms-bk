import express from "express";
import {
  getAll,
  getOne,
  createUpdate,
  deleteAppointment,
} from "../../../controllers/v1/nurse/appointments";
import { verifyNurse } from "../../../middlewares/auth";
import { entryPoint } from "../../../middlewares/entrypoint";
import { exitPoint } from "../../../middlewares/exitpoint";
import passport from "passport";

const router = express.Router();
/**
 * @swagger
 * /v1/nurse/appointments/create:
 *   post:
 *     tags:
 *       - nurse/appointments
 *     summary: Create or update an appointment
 *     description: Allows nurses to create or update appointments. The request should include an epoch timestamp for the date, and the response will return the date in ISO format.
 *     security:
 *       - nurseBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The ID of the appointment (required for update)
 *               patientId:
 *                 type: string
 *                 description: The ID of the patient for the appointment (required for create)
 *               doctorId:
 *                 type: string
 *                 description: The ID of the doctor assigned to the appointment
 *               date:
 *                 type: integer
 *                 format: int64
 *                 description: Epoch timestamp (milliseconds) for the scheduled appointment
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, NOT-ATTENDED, CANCELLED]
 *                 description: Status of the appointment (required for update, not needed in creation)
 *           examples:
 *             ExampleCreate:
 *               summary: Create an appointment
 *               value:
 *                 patientId: "67b6c3b098c669e6c66adef9"
 *                 doctorId: "67b6c0afb1fd18bba95f928a"
 *                 date: 1745990400000  # Example epoch timestamp (in milliseconds)
 *             ExampleUpdate:
 *               summary: Update an appointment
 *               value:
 *                 _id: "67c19180b2e8bfba6a12a561"
 *                 doctorId: "67bc28582dc692c7133ad092"
 *                 date: 1745990400000  # Example epoch timestamp (in milliseconds)
 *                 status: "completed"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Status code
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 appointmentId:
 *                   type: string
 *                   description: The ID of the newly created appointment
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: Scheduled appointment date in ISO 8601 format
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the item was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the item was last updated
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Status code
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 appointmentId:
 *                   type: string
 *                   description: The ID of the updated appointment
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: Scheduled appointment date in ISO 8601 format
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the item was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the item was last updated
 */

router.post(
  "/create",
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyNurse,
  createUpdate,
  exitPoint,
);
/**
 * @swagger
 * /v1/nurse/appointments/getAll:
 *   post:
 *     tags:
 *       - nurse/appointments
 *     security:
 *       - nurseBearerAuth: []  # Requires a bearer token
 *     summary: Get all appointments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include in the response
 *                 example:
 *                   _id: 1
 *                   patientId: 1
 *                   doctorId: 1
 *                   date: 1
 *                   status: 1
 *               filter:
 *                 type: object
 *                 description: Filters to apply when retrieving appointments
 *               options:
 *                 type: object
 *                 properties:
 *                   page:
 *                     type: integer
 *                     description: Page number for pagination
 *                   itemsPerPage:
 *                     type: integer
 *                     description: Number of items per page
 *                   sortBy:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Fields to sort by
 *                   sortDesc:
 *                     type: array
 *                     items:
 *                       type: boolean
 *                     description: Sort order (true for descending, false for ascending)
 *               search:
 *                 type: object
 *                 description: Search settings for the request
 *                 properties:
 *                   term:
 *                     type: string
 *                     description: Search term to match
 *                   fields:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Fields to search in
 *                   startsWith:
 *                     type: boolean
 *                     description: Whether to search from the start of the field
 *               date:
 *                 type: integer
 *                 description: The specific date in epoch format (milliseconds)
 *               fromDate:
 *                 type: integer
 *                 description: The starting date in epoch format (milliseconds)
 *               toDate:
 *                 type: integer
 *                 description: The ending date in epoch format (milliseconds)
 *           examples:
 *             projectionExample:
 *               summary: Projection Example
 *               value:
 *                 projection:
 *                   _id: 1
 *                   patientId: 1
 *                   doctorId: 1
 *                   date: 1
 *                   status: 1
 *             filterExample:
 *               summary: Filter Example
 *               value:
 *                 filter:
 *                   doctorId: "67b6c0afb1fd18bba95f928a"
 *                   status: "pending"
 *             singleDateExample:
 *               summary: Single-date Example
 *               value:
 *                 date: 1745990400  # Example epoch time
 *             multiDateExample:
 *               summary: Multi-date Example
 *               value:
 *                 fromDate: 17459
 *                 toDate: 1745990400
 *             paginationExample:
 *               summary: Pagination Example
 *               value:
 *                 options:
 *                   page: 1
 *                   itemsPerPage: 10
 *             sortExample:
 *               summary: Sort Example
 *               value:
 *                 options:
 *                   sortBy: ["createdAt"]
 *                   sortDesc: [true]
 *             searchExample:
 *               summary: Search Example
 *               value:
 *                 search:
 *                   term: "pending"
 *                   fields: ["status"]
 *                   startsWith: true
 */
router.post(
  "/getAll",
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyNurse,
  getAll,
  exitPoint,
);
/**
 * @swagger
 * /v1/nurse/appointments/getOne/{id}:
 *   post:
 *     tags:
 *       - nurse/appointments
 *     security:
 *       - nurseBearerAuth: []  # Requires a bearer token
 *     summary: Get one appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the appointment to retrieve
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include or exclude in the response
 *           examples:
 *             projectionExample:
 *               summary: Example with projection
 *               value:
 *                 projection:
 *                   _id: 1
 *                   patientId: 1  # Renamed from petId
 *                   doctorId: 1
 *                   date: 1
 *                   status: 1  # Renamed from schedule
 *                   createdAt: 1
 *                   updatedAt: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved appointment details.
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
 *                       description: The ID of the patient associated with the appointment
 *                     doctorId:
 *                       type: string
 *                       description: The ID of the doctor assigned to the appointment
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time of the appointment
 *                     status:
 *                       type: string
 *                       enum: ["PENDING", "CANCELLED", "COMPLETED", "NOTATTENDED"]
 *                       description: The current status of the appointment
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
 *                     status: "pending"
 *                     createdAt: "2025-02-01T08:00:00Z"
 *                     updatedAt: "2025-02-01T08:00:00Z"
 */

router.post(
  "/getOne/:id",
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyNurse,
  getOne,
  exitPoint,
);
/**
 * @swagger
 * /v1/nurse/appointments/delete/{id}:
 *   delete:
 *     tags:
 *       - nurse/appointments
 *     summary: Delete an appointment
 *     security:
 *       - nurseBearerAuth: []  # Requires a bearer token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the appointment to delete
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   format: int64
 *                   description: Status code
 *                 message:
 *                   type: string
 *                   description: Message describing the result of the operation
 *                 data:
 *                   type: string
 *                   description: The data that is sent
 *                 toastMessage:
 *                   type: string
 *                   description: The message that is sent
 *             examples:
 *               delete:
 *                 summary: Successful
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data: "Appointment deleted successfully"
 *                   toastMessage: "Appointment deleted successfully"
 */
router.delete(
  "/delete/:id",
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyNurse,
  deleteAppointment,
  exitPoint,
);

export default router;
