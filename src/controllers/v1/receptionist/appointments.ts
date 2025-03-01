import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";
import { CONSTANTS } from "../../../config/constant";
import moment from "moment";
import { AccessToken } from "../../../models/accessTokens";
export const createUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract access token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        toastMessage: "Unauthorized: Access token is missing",
      };
      return next();
    }

    const token = authHeader.split(" ")[1];

    // Find receptionist ID from AccessToken model
    const accessTokenRecord = await AccessToken.findOne({ token }).exec();
    if (!accessTokenRecord) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1001],
        toastMessage: "Unauthorized: Invalid access token",
      };
      return next();
    }

    const receptionistId = accessTokenRecord.userId;
    console.log("Authenticated receptionist ID:", receptionistId);

    const { _id, doctorId, patientId, date, status } = req.body;
    console.log("Received request data:", req.body);

    // Prevent unauthorized modification of patientId or doctorId during an update
    if (_id && (req.body.patientId || req.body.doctorId)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        toastMessage:
          "You cannot modify patientId or doctorId during an update",
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
    let parsedDate: Date | null = null;
    if (date) {
      const formattedDate = moment(date, "DD-MM-YYYY", true);
      if (!formattedDate.isValid()) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1004],
          toastMessage: "Invalid date format. Use 'DD-MM-YYYY'.",
        };
        return next();
      }
      parsedDate = formattedDate.toDate();
    }

    const validatedStatus = status || CONSTANTS.APPOINTMENT_STATUS.PENDING; // Default status

    let appointment;
    const isUpdate = Boolean(_id);

    if (isUpdate) {
      // Update appointment only if it belongs to the logged-in receptionist
      appointment = await AppointmentModel.findOneAndUpdate(
        { _id, receptionistId }, // Ensure the appointment belongs to the receptionist
        {
          ...(doctorId && { doctorId }),
          ...(parsedDate && { date: parsedDate }),
          status: validatedStatus,
        },
        { new: true },
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
      // Create a new appointment, automatically setting receptionistId
      appointment = await new AppointmentModel({
        doctorId,
        patientId,
        date: parsedDate,
        receptionistId, // Taken from AccessToken model
        status: CONSTANTS.APPOINTMENT_STATUS.PENDING,
      }).save();
    }

    console.log("Created/Updated appointment:", appointment);

    req.apiStatus = {
      isSuccess: true,
      message: isUpdate
        ? "Appointment record updated successfully"
        : "Appointment added successfully",
      data: isUpdate
        ? { ...appointment.toObject() } // Return all updated fields
        : {
            _id: appointment._id,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
          }, // Only selected fields for creation
      toastMessage: isUpdate
        ? "Appointment record updated successfully"
        : "Appointment added successfully",
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

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      projection = {},
      filter = {},
      options = {},
      search = [],
      date,
      fromDate,
      toDate,
    } = req.body;

    // Call reusable aggregation function
    const { totalCount, tableData } = await aggregateData(
      AppointmentModel,
      filter,
      projection,
      options,
      search,
      date,
      fromDate,
      toDate,
    );

    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: { totalCount, tableData },
    };
    next();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1003],
        toastMessage: "Invalid appointment ID",
      };
      return next();
    }

    const result = await aggregateData(
      AppointmentModel,
      { _id: new mongoose.Types.ObjectId(id) },
      projection,
    );

    if (!result.tableData.length) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1004],
        toastMessage: "Appointment not found or deleted",
      };
      return next();
    }

    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: result.tableData[0], // Access the first element of tableData
    };
    next();
  } catch (error) {
    console.error("Error fetching appointment:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
  }
};
export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1003],
        toastMessage: "Invalid appointment ID provided",
      };
      return next();
    }

    const appointment = await AppointmentModel.findByIdAndDelete(id).exec();

    if (!appointment) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1004],
        toastMessage: "Appointment not found or already deleted",
      };
      return next();
    }

    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: "Appointment deleted successfully",
      toastMessage: "Appointment deleted successfully",
    };
    next();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
  }
};
