import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { aggregateData } from "../../../utils/aggregation";
import { CONSTANTS } from "../../../config/constant";
import { ErrorCodes } from "../../../models/models";
import test from "node:test";
/**
 * Create or update an appointment (Nurse only)
 */
export const createUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract nurse ID from authenticated user
        const user = req.user as { _id?: string };
        const nurseId = user?._id; 
    //    console.log("Authenticated user:", req.user);

        if (!nurseId) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1001],
                toastMessage: "Unauthorized access",
            };
            return next();
        }

        const { _id, doctorId, patientId, date, status } = req.body;
      //  console.log("Received patientId:", req.body.patientId);

        // Prevent unauthorized modification of nurseId or patientId
        if (_id && (req.body.patientId || req.body.nurseId)) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1002],
                toastMessage: "You cannot modify patientId or nurseId during an update",
            };
            return next();
        }

        // Validate `_id`
        if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1003],
                toastMessage: "Invalid Appointment ID",
            };
            return next();
        }

        // Validate Date
        const parsedDate = date ? new Date(date) : null;
        if (date && isNaN(parsedDate!.getTime())) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1005],
                toastMessage: "Invalid date format. Use YYYY-MM-DD.",
            };
            return next();
        }

        const validatedStatus = status || CONSTANTS.APPOINTMENT_STATUS.PENDING; // Default status

        let appointment;
        const isUpdate = Boolean(_id);

        if (isUpdate) {
            // Update appointment only if it belongs to the logged-in nurse
            appointment = await AppointmentModel.findOneAndUpdate(
                { _id, nurseId },  // Ensure the appointment belongs to the nurse
                { 
                    ...(doctorId && { doctorId }),
                    ...(parsedDate && { date: parsedDate }),
                    status: validatedStatus
                }, 
                { new: true }
            ).exec();

            if (!appointment) {
                req.apiStatus = {
                    isSuccess: false,
                    error: ErrorCodes[1004],
                    toastMessage: "Appointment record not found",
                };
                return next();
            }
        } else {
            // Create a new appointment, automatically setting nurseId
            appointment = await new AppointmentModel({
                doctorId,
                date: parsedDate,
                nurseId, // Taken from req.user
                patientId, // Make sure this is extracted from req.body
                status: CONSTANTS.APPOINTMENT_STATUS.PENDING
            }).save();
        }
      
        
        req.apiStatus = {
            isSuccess: true,
            message: isUpdate ? "Appointment record updated successfully" : "Appointment added successfully",
            data: isUpdate 
                ? { ...appointment.toObject() }  // Return all updated fields
                : { _id: appointment._id, createdAt: appointment.createdAt, updatedAt: appointment.updatedAt }, // Only selected fields for creation
            toastMessage: isUpdate ? "Appointment record updated successfully" : "Appointment added successfully",
        };
        next();
        return;
    } catch (error) {
        console.error("Error in createUpdate:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1006],
            toastMessage: "Internal Server Error",
        };
        next();
        return;
    }
    
};



/**
 * Get all appointments for the logged-in nurse
 */

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user as { _id?: string };
        if (!user?._id) {
            req.apiStatus = {
                isSuccess: false,
                message: "Unauthorized access",
                toastMessage: "User not authenticated",
                error: { statusCode: 401, message: "Unauthorized" },
            };
            return next();
        }

        let { projection = {}, filter = {}, options = {}, search = [], date, fromDate, toDate } = req.body;

        // Restrict nurses to only see their own appointments
        const nurseFilter = { ...filter, nurseId: user._id };

        // Convert date formats if provided
        if (date) {
            nurseFilter.date = new Date(date).toISOString();
        }
        if (fromDate && toDate) {
            nurseFilter.date = { $gte: new Date(fromDate).toISOString(), $lte: new Date(toDate).toISOString() };
        }

        const { totalCount, tableData } = await aggregateData(
            AppointmentModel,
            nurseFilter,
            projection,
            options,
            search
        );

        if (!tableData.length) {
            req.apiStatus = {
                isSuccess: false,
                message: "No appointments found",
                toastMessage: "No records available",
            };
            return next();
        }
        
        console.log("Fetched Data: ", tableData);

        // Format response
        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: {
                totalCount,
                tableData: tableData.map((appointment: { _id: any; petId: any; doctorId: any; date: string | number | Date; schedule: any; createdAt: string | number | Date; updatedAt: string | number | Date; }) => ({
                    _id: appointment._id,
                    patientId: appointment.petId, // Rename petId to patientId
                    doctorId: appointment.doctorId,
                    date: new Date(appointment.date).toISOString(),
                    status: appointment.schedule, // Rename schedule to status
                    createdAt: new Date(appointment.createdAt).toISOString(),
                    updatedAt: new Date(appointment.updatedAt).toISOString(),
                })),
            },
        };
        console.log("Final Projection: ", projection);
        next();
    } catch (error) {
        console.error("Error fetching appointments:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
        };
        next();
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user as { _id?: string };
        if (!user?._id) {
            req.apiStatus = {
                isSuccess: false,
                message: "Unauthorized access",
                toastMessage: "User not authenticated",
                error: { statusCode: 401, message: "Unauthorized" },
            };
            return next();
        }

        const { id } = req.params;
        const { projection = {} } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
                isSuccess: false,
                message: "Invalid appointment ID",
                toastMessage: "Invalid record",
                error: {
                    statusCode: 400,
                    message: ""
                },
            };
            return next();
        }

        const result = await aggregateData(
            AppointmentModel,
            { _id: new mongoose.Types.ObjectId(id), nurseId: user._id },
            projection
        );

        if (!result.tableData.length) {
            req.apiStatus = {
                isSuccess: false,
                message: "Record not found or deleted",
                toastMessage: "No record found",
            };
            return next();
        }

        // Format response
        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: {
                _id: result.tableData[0]._id,
                patientId: result.tableData[0].petId, // Rename petId to patientId
                doctorId: result.tableData[0].doctorId,
                date: new Date(result.tableData[0].date).toISOString(),
                status: result.tableData[0].schedule, // Rename schedule to status
                createdAt: new Date(result.tableData[0].createdAt).toISOString(),
                updatedAt: new Date(result.tableData[0].updatedAt).toISOString(),
            },
        };

        next();
    } catch (error) {
        console.error("Error fetching appointment:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
        };
        next();
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
