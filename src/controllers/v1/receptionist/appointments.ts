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
    const user = req.user as { id: string; role: string; email: string };
    const receptionistId = user.id; // Authenticated receptionist ID

    console.log("Authenticated receptionist ID:", receptionistId);
    console.log("Received request data:", req.body);

    let { _id, doctorId, patientId, date, status } = req.body;

    // Prevent modifying `patientId` during an update
    if (_id && patientId) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        toastMessage: "You cannot modify patientId during an update",
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

    // Ensure date remains in epoch milliseconds format
    if (date && typeof date !== "number") {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1004],
        toastMessage: "Invalid date format. Use epoch time in milliseconds.",
      };
      return next();
    }

    // Convert status to lowercase if provided
    if (status) {
      status = status.toLowerCase();
      // Ensure status is a valid enum value
      if (!Object.values(CONSTANTS.APPOINTMENT_STATUS).includes(status)) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1005],
          toastMessage: "Invalid appointment status",
        };
        return next();
      }
    } else {
      status = CONSTANTS.APPOINTMENT_STATUS.PENDING; // Default status
    }

    let appointment;
    const isUpdate = Boolean(_id);

    if (isUpdate) {
      // Update appointment only if it belongs to the logged-in receptionist
      appointment = await AppointmentModel.findOneAndUpdate(
        { _id, receptionistId },
        {
          ...(doctorId && { doctorId }), // Allow doctorId updates
          ...(date && { date }), // Keep date as epoch time
          status, // Store status in lowercase
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
      // Create new appointment
      appointment = await new AppointmentModel({
        doctorId,
        patientId,
        date,
        receptionistId,
        status, // Store status in lowercase
      }).save();
    }

    console.log("Created/Updated appointment:", appointment);

    res.status(200).json({
      status: 200,
      message: "Success",
      data: isUpdate
        ? "Appointment record updated successfully"
        : "Appointment added successfully",
      toastMessage: isUpdate
        ? "Appointment record updated successfully"
        : "Appointment added successfully",
    });
  } catch (error) {
    console.error("Error in createUpdate:", error);
    res.status(500).json({
      status: 500,
      message: "Error",
      error: ErrorCodes[1006],
      toastMessage: "Internal Server Error",
    });
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
