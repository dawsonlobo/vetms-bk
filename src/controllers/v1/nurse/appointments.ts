import { Request, Response } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { ResponseObj } from "../../../models/models";
import { aggregateData } from "../../../utils/aggregation";
import logger from "../../../logger/v1/logger";

/**
 * Create or update an appointment (Nurse only)
 */
export const createUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as { _id?: string }; // Ensure user type
        if (!user?._id) {
            req.apiStatus = {
                isSuccess: false,
                message: "Unauthorized access",
                error: { statusCode: 401, message: "User not authenticated" },
            };
            return;
        }

        const { _id, doctorId, date, status } = req.body;
        const nurseId = user._id; // Extract nurseId from authenticated user

        // Prevent sending restricted fields
        if (req.body.patientId || req.body.nurseId) {
            req.apiStatus = {
                isSuccess: false,
                message: "Invalid fields in request",
                error: { statusCode: 400, message: "You cannot modify patientId or nurseId" },
            };
            return;
        }

        // Validate _id if updating
        if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
            req.apiStatus = {
                isSuccess: false,
                message: "Invalid Appointment ID",
                error: { statusCode: 400, message: "Invalid Appointment ID provided" },
            };
            return;
        }

        let isUpdate = Boolean(_id);
        let appointment;

        if (isUpdate) {
            appointment = await AppointmentModel.findOneAndUpdate(
                { _id, nurseId }, // Ensure only assigned nurse can update
                { doctorId, date, status }, // Only allowed fields
                { new: true }
            ).exec();

            if (!appointment) {
                req.apiStatus = {
                    isSuccess: false,
                    message: "Unauthorized update attempt or appointment not found",
                    error: { statusCode: 403, message: "You can only update your assigned appointments" },
                };
                return;
            }
        } else {
            appointment = await new AppointmentModel({
                doctorId,
                date,
                nurseId,
                status: "PENDING",
            }).save();
        }

        req.apiStatus = {
            isSuccess: true,
            message: isUpdate ? "Appointment updated successfully" : "Appointment added successfully",
            data: appointment,
        };
    } catch (error) {
        logger.error("Error in createUpdate:", error);
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

        const nurseId = user._id;
        const { projection = {}, filter = {}, options = {}, search = [], date, fromDate, toDate } = req.body;

        const { totalCount, tableData } = await aggregateData(
            AppointmentModel,
            { ...filter, nurseId },
            projection,
            options,
            search,
            date,
            fromDate,
            toDate
        );

        req.apiStatus = {
            isSuccess: true,
            message: "Appointments retrieved successfully",
            data: { totalCount, tableData },
        };
    } catch (error) {
        logger.error("Error fetching appointments:", error);
        req.apiStatus = {
            isSuccess: false,
            message: "Internal Server Error",
            error: { statusCode: 500, message: "Something went wrong while fetching appointments" },
        };
    }
};

/**
 * Get a single appointment (only if assigned to logged-in nurse)
 */
export const getOne = async (req: Request, res: Response): Promise<void> => {
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

        const { id } = req.params;
        const { projection } = req.body;
        const nurseId = user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
                isSuccess: false,
                message: "Invalid appointment ID",
                error: { statusCode: 400, message: "Invalid appointment ID provided" },
            };
            return;
        }

        const result = await aggregateData(
            AppointmentModel,
            { _id: new mongoose.Types.ObjectId(id), nurseId },
            projection
        );

        if (!result.tableData.length) {
            req.apiStatus = {
                isSuccess: false,
                message: "Appointment not found or unauthorized",
                error: { statusCode: 404, message: "Appointment not found or unauthorized access" },
            };
            return;
        }

        req.apiStatus = {
            isSuccess: true,
            message: "Appointment retrieved successfully",
            data: result.tableData[0],
        };
    } catch (error) {
        logger.error("Error fetching appointment:", error);
        req.apiStatus = {
            isSuccess: false,
            message: "Internal Server Error",
            error: { statusCode: 500, message: "Something went wrong while fetching the appointment" },
        };
    }
};

/**
 * Delete an appointment (only if assigned to logged-in nurse)
 */
export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
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

        const { id } = req.params;
        const nurseId = user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
                isSuccess: false,
                message: "Invalid appointment ID",
                error: { statusCode: 400, message: "Invalid appointment ID provided" },
            };
            return;
        }

        const appointment = await AppointmentModel.findOneAndDelete({ _id: id, nurseId }).exec();

        if (!appointment) {
            req.apiStatus = {
                isSuccess: false,
                message: "Appointment not found or unauthorized",
                error: { statusCode: 404, message: "You can only delete your assigned appointments" },
            };
            return;
        }

        req.apiStatus = {
            isSuccess: true,
            message: "Appointment deleted successfully",
            data: appointment,
        };
    } catch (error) {
        logger.error("Error deleting appointment:", error);
        req.apiStatus = {
            isSuccess: false,
            message: "Internal Server Error",
            error: { statusCode: 500, message: "Something went wrong while deleting the appointment" },
        };
    }
};
