import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { Notification } from "../../../models/notifications";
import UserModel from "../../../models/users";
import { PatientModel } from "../../../models/patients";
import { ErrorCodes } from "../../../models/models";
import { CONSTANTS } from "../../../config/constant";
import moment from "moment";
import { AccessToken } from "../../../models/accessTokens";
import { aggregateData } from "../../../utils/aggregation";

export const createUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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

    const { _id, patientId, doctorId, date, status, ...appointmentData } =
      req.body;
    console.log("Received request data:", req.body);

    if (_id && (req.body.patientId || req.body.doctorId)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        toastMessage:
          "You cannot modify patientId or doctorId during an update",
      };
      return next();
    }

    if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1003],
        toastMessage: "Invalid Appointment ID",
      };
      return next();
    }

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

    const validatedStatus = status || CONSTANTS.APPOINTMENT_STATUS.PENDING;
    let appointment;
    const isUpdate = Boolean(_id);

    if (isUpdate) {
      appointment = await AppointmentModel.findOneAndUpdate(
        { _id, receptionistId },
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
      appointment = await new AppointmentModel({
        doctorId,
        patientId,
        date: parsedDate,
        receptionistId,
        status: CONSTANTS.APPOINTMENT_STATUS.PENDING,
      }).save();
    }

    console.log("Created/Updated appointment:", appointment);

    const receptionist = await UserModel.findById(receptionistId)
      .select("name")
      .lean();
    const receptionistName = receptionist
      ? receptionist.name
      : "Unknown Receptionist";
    const patient = await PatientModel.findById(patientId)
      .select("name")
      .lean();
    const patientName = patient ? patient.name : "Unknown Patient";
    const adminUsers = await getAdminUsers();

    for (const adminId of adminUsers) {
      await new Notification({
        title: isUpdate ? "Appointment Updated" : "New Appointment Added",
        message: `${receptionistName} added ${patientName}`,
        userId: adminId,
        otherDetails: {
          appointmentId: appointment._id,
          receptionistId,
          patientId,
        },
      }).save();
    }

    req.apiStatus = {
      isSuccess: true,
      message: isUpdate
        ? "Appointment record updated successfully"
        : "Appointment added successfully",
      data: appointment,
      toastMessage: isUpdate
        ? "Appointment record updated successfully"
        : "Appointment added successfully",
    };
    next();
  } catch (error) {
    console.error("Error in createUpdate:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1006],
      toastMessage: "Internal Server Error",
    };
    next();
  }
};
const getAdminUsers = async (): Promise<string[]> => {
  const admins = await UserModel.find({ role: "ADMIN" }, "_id").exec();
  return admins.map((admin: { _id: { toString: () => any } }) =>
    admin._id.toString(),
  );
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
    const projection = req.body.projection || {};

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

    if (!result.tableData || result.tableData.length === 0) {
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
      data: result.tableData[0], // Return first element if exists
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
