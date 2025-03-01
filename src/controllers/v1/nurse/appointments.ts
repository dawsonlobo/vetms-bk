import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { aggregateData } from "../../../utils/aggregation";
import { CONSTANTS } from "../../../config/constant";
import { ErrorCodes } from "../../../models/models";
import test from "node:test";
import UserModel from "../../../models/users";
/**
 * Create or update an appointment (Nurse only)
 */
export const createUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract nurse ID from authenticated user
        const user = req.user as { _id?: string };
        const nurseId = user?._id;
  
        if (!nurseId) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1001],
                toastMessage: "Unauthorized access",
            };
            return next();
        }
  
        // Check if the nurse account is deleted or disabled
        const nurse = await UserModel.findById(nurseId);
        if (!nurse || nurse.isDeleted === true || nurse.isEnabled === false) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1007], 
                toastMessage: "You cannot create or update appointments with a disabled or deleted account.",
            };
            return next();
        }
  
        const { _id, doctorId, patientId, date, status } = req.body;
  
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
  
        // Convert epoch timestamp to ISO format
        let parsedDate: Date | null = null;
        if (date) {
            if (typeof date === "number") {
                parsedDate = new Date(date); // Convert epoch timestamp
            } else if (typeof date === "string") {
                parsedDate = new Date(date);
            }
  
            if (isNaN(parsedDate!.getTime())) {
                req.apiStatus = {
                    isSuccess: false,
                    error: ErrorCodes[1005],
                    toastMessage: "Invalid date format. Use epoch timestamp.",
                };
                return next();
            }
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
                ? {
                    _id: appointment._id,
                    createdAt: appointment.createdAt,
                    updatedAt: appointment.updatedAt,
                    ...(doctorId && { doctorId }),
                    ...(parsedDate && { date: new Date(parsedDate).toISOString() }),
                    ...(status && { status })
                }
                : {
                    _id: appointment._id,
                    createdAt: appointment.createdAt,
                    updatedAt: appointment.updatedAt
                },
            toastMessage: isUpdate ? "Appointment record updated successfully" : "Appointment added successfully",
        };
        return next();
    } catch (error) {
        console.error("Error in createUpdate:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1006],
            toastMessage: "Internal Server Error",
        };
        return next();
    }
  };
  

/**
 * Get all appointments for the logged-in nurse
 */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {
            projection = {},
            filter = {},
            options = {},
            search = {},
            date,
            fromDate,
            toDate,
        } = req.body;

        // Remove `isDeleted` from projection
        const Projection = { ...projection };
        delete Projection.isDeleted;

        // Ensure filtering conditions
        const Filter: any = { ...filter, isDeleted: false, isEnabled: true };

        if (filter.doctorId) {
            try {
                Filter.doctorId = new Object(filter.doctorId);
            } catch (error) {
                console.error("Invalid ObjectId format:", filter.doctorId);
            }
        }

        if (filter.status) {
            Filter.status = filter.status.toUpperCase(); // Ensure case consistency
        }

        // Convert **milliseconds epoch** to proper date at UTC midnight
        const parseEpoch = (epoch: number): Date => {
            const dateObj = new Date(epoch);
            dateObj.setUTCHours(0, 0, 0, 0);
            return dateObj;
        };

        // Apply single date filtering
        if (date) {
            const isoDate = parseEpoch(date);
            Filter.date = {
                $gte: isoDate,
                $lt: new Date(isoDate.getTime() + 86400000), // Next day midnight
            };
        }

        // Apply date range filtering
        if (fromDate && toDate) {
            Filter.date = {
                $gte: parseEpoch(fromDate),
                $lte: parseEpoch(toDate),
            };
        }

        // Apply search filters
        if (search.term && search.fields && Array.isArray(search.fields)) {
            const regex = search.startsWith
                ? new RegExp(`^${search.term}`, "i")
                : new RegExp(search.term, "i");

            Filter.$or = search.fields.map((field: string) => ({
                [field]: { $regex: regex },
            }));
        }

        // Sorting options
        const sortBy = options.sortBy?.[0] || "createdAt";
        const sortOrder = options.sortDesc?.[0] ? -1 : 1;
        const sortOptions = { [sortBy]: sortOrder };

        // Call reusable aggregation function
        const { totalCount, tableData } = await aggregateData(
            AppointmentModel,
            Filter,
            Projection,
            { ...options, sort: sortOptions }
        );

        // Convert only `date` field to ISO format in response
        const formattedData = tableData.map((appointment: any) => {
            const { date, ...rest } = appointment; // Remove `date` if it's null
            return date ? { ...rest, date: new Date(date).toISOString() } : rest;
        });

        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: { totalCount, tableData: formattedData },
        };
        next();
    } catch (error) {
        console.error("Error fetching data:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
        };
        next();
    }
}

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

      // Validate ID format before making DB calls
      if (!mongoose.Types.ObjectId.isValid(id)) {
          req.apiStatus = {
              isSuccess: false,
              message: "Invalid appointment ID",
              toastMessage: "Invalid record",
              error: {
                  statusCode: 400,
                  message: "The provided ID format is incorrect.",
              },
          };
          return next();
      }

      // Ensure isDeleted is always excluded from projection
      const Projection = { ...projection };
      delete Projection.isDeleted;

      // Fetch appointment data
      const result = await aggregateData(
          AppointmentModel,
          { _id: new mongoose.Types.ObjectId(id), nurseId: user._id, isDeleted: false },
          Projection
      );

      // Handle case where no record is found
      if (!result?.tableData?.length) {
          req.apiStatus = {
              isSuccess: false,
              message: "Record not found or deleted",
              toastMessage: "No record found",
          };
          return next();
      }

      const appointment = result.tableData[0];

      // Return formatted response with ISO date
      req.apiStatus = {
        isSuccess: true,
        message: "Success",
        data: {
            _id: appointment._id,
            patientId: appointment.patientId ?? appointment.petId, // Ensure correct field mapping
            doctorId: appointment.doctorId,
            date: appointment.date ? new Date(appointment.date * 1000).toISOString() : null, // Convert from epoch to ISO
            status: appointment.status ?? appointment.schedule, // Ensure correct mapping
            createdAt: appointment.createdAt, // No need to convert, handled by Mongoose
            updatedAt: appointment.updatedAt, // No need to convert, handled by Mongoose
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
