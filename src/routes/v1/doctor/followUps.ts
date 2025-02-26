import { Router,Request,Response, NextFunction } from 'express';
import * as followUp from '../../../controllers/v1/doctor/followUps'
const router = Router();


/**
 * @swagger
 *paths:
 *  /v1/doctor/followUps/create:
 *    post:
 *      summary: Create a new follow-up record
 *      tags: 
 *        - doctor/followups
 *      security:
 *        - doctorBearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - patientId
 *                - doctorId
 *                - diagnosis
 *                - treatment
 *                - prescription
 *                - visitDate
 *              properties:
 *                patientId:
 *                  type: string
 *                  format: ObjectId
 *                  description: Unique ID of the pet associated with the follow-up
 *                doctorId:
 *                  type: string
 *                  format: ObjectId
 *                  description: Unique ID of the doctor responsible for the follow-up
 *                diagnosis:
 *                  type: string
 *                  description: Diagnosis of the pet's condition
 *                treatment:
 *                  type: string
 *                  description: Treatment provided to the pet
 *                prescription:
 *                  type: string
 *                  description: Prescribed medications for the pet
 *                visitDate:
 *                  type: string
 *                  format: date
 *                  description: Date of the follow-up visit
 *            examples:
 *              Example 1:
 *                summary: Example of a follow-up record
 *                value:
 *                  patientId: "67b6c39098c669e6c66adef8"
 *                  doctorId: "67bbfed74cea23da08bb62a6"
 *                  diagnosis: "Skin infection due to allergy"
 *                  treatment: "Antibiotic injection and medicated shampoo"
 *                  prescription: "Amoxicillin 250mg, Antihistamines"
 *                  visitDate: "2024-02-10"
 *              Example 2:
 *                summary: Another example of a follow-up record
 *                value:
 *                  patientId: "6512c5f3e4b09a12d8f42b80"
 *                  doctorId: "6512c5f3e4b09a12d8f42b81"
 *                  diagnosis: "Ear infection"
 *                  treatment: "Ear drops and pain relief medication"
 *                  prescription: "Otibiotic ointment, Ibuprofen"
 *                  visitDate: "2024-03-15"
 *      responses:
 *        201:
 *          description: Follow-up record created successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                    format: int64
 *                    description: Status code
 *                  message:
 *                    type: string
 *                    description: Message describing the result of the operation
 *                  data:
 *                    type: string
 *                    description: The response data
 *                  toastMessage:
 *                    type: string
 *                    description: The toast message
 *              examples:
 *                example1:
 *                  summary: Successful follow-up record creation response
 *                  value:
 *                    status: 201
 *                    message: "Success"
 *                    data: "Follow-up record created successfully"
 *                    toastMessage: "Follow-up recorded successfully"
 */



router.post("/create",followUp.createFollowUp);
router.post("/getone",followUp.getOne);



/**
 * @swagger
 * /v1/doctor/followups/delete/{id}:
 *   post:
 *     summary: Delete a follow-up record
 *     tags: 
 *       - doctor/followups
 *     security:
 *       - adminBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the follow-up record to be deleted
 *     responses:
 *       200:
 *         description: Follow-up record deleted successfully
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
 *                   description: The response data
 *                 toastMessage:
 *                   type: string
 *                   description: The toast message
 *             example:
 *               status: 200
 *               message: "Success"
 *               data: "Follow-up record deleted successfully"
 *               toastMessage: "Follow-up successfully deleted"
 *       404:
 *         description: Follow-up record not found or already deleted
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
 *                 error:
 *                   type: string
 *             example:
 *               status: 404
 *               message: "error"
 *               error: "Follow-up record not found or already deleted"
 */

router.post("/delete/:id",followUp.deleteFollowUp);




export default router;