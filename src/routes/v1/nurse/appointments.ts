import express from "express";
import {getAll,getOne,createUpdate, deleteAppointment} from '../../../controllers/v1/nurse/appointments';
import {  verifyNurse } from '../../../middlewares/auth';
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
 *                 type: string
 *                 format: date
 *                 description: The scheduled date of the appointment in YYYY-MM-DD format
 *               status:
 *                 type: string
 *                 enum: [PENDING,COMPLETED,NOT-ATTENDED,CANCELLED]
 *                 description: Status of the appointment (required for update, not needed in creation)
 *           examples:
 *             ExampleCreate:
 *               summary: Create an appointment
 *               value:
 *                 patientId: "67b6c3b098c669e6c66adef9"
 *                 doctorId: "67bc28582dc692c7133ad092"
 *                 date: "2025-02-28"
 *             ExampleUpdate:
 *               summary: Update an appointment
 *               value:
 *                 _id: "67c1234a5bc678d9e0123456"
 *                 doctorId: "67bc28582dc692c7133ad092"
 *                 date: "2025-02-28"
 *                 status: "CONFIRMED"
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
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the item was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the item was last updated
 */

router.post("/create", entryPoint,passport.authenticate("bearer", { session: false }), verifyNurse, createUpdate, exitPoint);



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
 *                 type: string
 *                 format: date
 *                 description: The specific date in YYYY-MM-DD format
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 description: The starting date in YYYY-MM-DD format
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: The ending date in YYYY-MM-DD format
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
 *                   createdAt: 1
 *                   updatedAt: 1
 *             filterExample:
 *               summary: Filter Example
 *               value:
 *                 filter:
 *                   doctorId: "66b3279c39c21f7342c13333"
 *                   status: "PENDING"
 *                   patientId: { "$in": ["66b3279c39c21f7342c12222", "66b3279c39c21f7342c14444"] }
 *             singleDateExample:
 *               summary: Single-date Example
 *               value:
 *                 date: "2025-02-28"
 *             multiDateExample:
 *               summary: Multi-date Example
 *               value:
 *                 fromDate: "2025-02-01"
 *                 toDate: "2025-02-28"
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
 *                   sortBy:
 *                     - "createdAt"
 *                   sortDesc:
 *                     - true
 *             searchExample:
 *               summary: Search Example
 *               value:
 *                 search:
 *                   - term: "PENDING"
 *                     fields: ["status"]
 *                     startsWith: true
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
 *                             description: The ID of the patient
 *                           doctorId:
 *                             type: "string"
 *                             description: The ID of the doctor
 *                           date:
 *                             type: "string"
 *                             format: "date-time"
 *                             description: The date and time of the appointment in ISO 8601 format
 *                           status:
 *                             type: "string"
 *                             enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NOTATTENDED"] 
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
 *                         status: "PENDING"
 *                         createdAt: "2025-02-01T08:00:00Z"
 *                         updatedAt: "2025-02-01T08:00:00Z"
 *                     -   _id: "66b3279c39c21f7342c1520n"
 *                         patientId: "66b3279c39c21f7342c14444"
 *                         doctorId: "66b3279c39c21f7342c15555"
 *                         date: "2025-02-02T10:30:00Z"
 *                         status: "COMPLETED"
 *                         createdAt: "2025-02-02T08:00:00Z"
 *                         updatedAt: "2025-02-02T08:00:00Z"
 */
router.post("/getAll", entryPoint, passport.authenticate("bearer", { session: false }),verifyNurse, getAll, exitPoint);
/**
 * @swagger
 * /v1/nurse/appointments/getOne/{id}:
 *   post:
 *     tags:
 *       - nurse/appointments
 *     security:
 *       - nurseBearerAuth: []  # Requires a bearer token
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
 *                   petId: 1
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
 *                     petId:
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
 *                     petId: "66b3279c39c21f7342c1520p"
 *                     doctorId: "66b3279c39c21f7342c1520d"
 *                     date: "2025-02-19T10:00:00Z"
 *                     schedule: "SCHEDULED"
 *                     createdAt: "2025-02-01T08:00:00Z"
 *                     updatedAt: "2025-02-01T08:00:00Z"
 */
router.get("/getOne/:id", entryPoint,passport.authenticate("bearer", { session: false }),verifyNurse, getOne, exitPoint);
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
router.delete("/delete/:id", entryPoint,passport.authenticate("bearer", { session: false }),verifyNurse,deleteAppointment, exitPoint);


     export default router;