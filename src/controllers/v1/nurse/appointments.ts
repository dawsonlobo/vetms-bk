import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { aggregateData } from "../../../utils/aggregation";

/**
 * Create or update an appointment (Nurse only)
 */

export const createUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as { _id?: string }; 
        const nurseId = user?._id; // Extract nurse ID from user
        
        if (!nurseId) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }

        const { _id, doctorId, date, status } = req.body;

        // Prevent modification of restricted fields during an update
        if (_id && (req.body.patientId || req.body.nurseId)) {
            req.apiStatus = {
                isSuccess: false,
                message: "Invalid fields in request",
                error: { statusCode: 400, message: "You cannot modify patientId or nurseId during an update" },
            };
            return;
        }

        // Validate `_id` if updating
        if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
            res.status(400).json({ status: 400, message: "Invalid Appointment ID" });
            return;
        }

        const isUpdate = Boolean(_id);
        let appointment;

        if (isUpdate) {
            // Update appointment (Only update provided fields)
            appointment = await AppointmentModel.findOneAndUpdate(
                { _id, nurseId }, // Ensure only assigned nurse can update
                { 
                    ...(doctorId && { doctorId }),
                    ...(date && { date }),
                    ...(status && { status }) 
                }, 
                { new: true }
            ).exec();
        } else {
            // Create new appointment with status "PENDING"
            appointment = await new AppointmentModel({
                doctorId,
                date,
                nurseId,
                status: "PENDING", 
                createdAt: new Date(),
                updatedAt: new Date(),
            }).save();
        }

        req.apiStatus = {
            isSuccess: !!appointment,
            message: appointment
                ? (isUpdate ? "Appointment updated successfully" : "Appointment added successfully")
                : "Failed to create/update appointment",
            data: appointment || undefined,
        };
    } catch (error) {
        console.error("Error in createUpdate:", error);
        req.apiStatus = {
            isSuccess: false,
            message: "Internal Server Error",
            error: { statusCode: 500, message: "Something went wrong while processing the appointment" },
        };
    }
};

/**
 * Get all appointments for the logged-in nurse
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as { _id?: string };
        if (!user?._id) {
            req.apiStatus = {
                isSuccess: false,
                message: "Unauthorized access",
                error: { statusCode: 401, message: "User not authenticated" },
            };
            return;
        }

        const { projection = {}, filter = {}, options = {}, search = [], date, fromDate, toDate } = req.body;
        
        // Ensure nurses can only see their assigned appointments
        const nurseFilter = { ...filter, nurseId: user._id };

        const { totalCount, tableData } = await aggregateData(
            AppointmentModel,
            nurseFilter,
            projection,
            options,
            search,
            date,
            fromDate,
            toDate
        );

        res.status(200).json({ status: 200, message: "Success", data: { totalCount, tableData } });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user as { _id?: string };
        if (!user?._id) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }

        const { id } = req.params;
        const { projection } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ status: 400, message: "Invalid appointment ID" });
            return;
        }

        const result = await aggregateData(
            AppointmentModel,
            { _id: new mongoose.Types.ObjectId(id), nurseId: user._id },
            projection
        );

        if (!result.tableData.length) {
            res.status(404).json({ status: 404, message: "Appointment not found or unauthorized" });
            return;
        }

        res.status(200).json({ status: 200, message: "Success", data: result.tableData[0] });
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as { _id?: string };
        if (!user?._id) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ status: 400, message: "Invalid appointment ID" });
            return;
        }

        const appointment = await AppointmentModel.findOneAndDelete({ _id: id, nurseId: user._id }).exec();

        if (!appointment) {
            res.status(404).json({ status: 404, message: "Appointment not found or unauthorized" });
            return;
        }

        res.status(200).json({ status: 200, message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};
