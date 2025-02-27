import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";

export const createUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const { _id, ...appointmentData } = req.body;

      if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1003],
              toastMessage: "Invalid Appointment ID provided",
          };
          return next();
      }

      let isUpdate = Boolean(_id);
      let appointment;

      if (isUpdate) {
          appointment = await AppointmentModel.findByIdAndUpdate(_id, appointmentData, { new: true }).exec();
      } else {
          appointment = await new AppointmentModel(appointmentData).save();
      }

      if (!appointment) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1004],
              toastMessage: "Appointment record not found",
          };
          return next();
      }

      req.apiStatus = {
          isSuccess: true,
          message: isUpdate ? "Appointment record updated successfully" : "Appointment added successfully",
          data: appointment,
          toastMessage: isUpdate ? "Appointment record updated successfully" : "Appointment added successfully",
      };
      next();
  } catch (error) {
      console.error("Error in createUpdate:", error);
      req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1002],
          toastMessage: "Something went wrong. Please try again.",
      };
      next();
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      toDate
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

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const result = await aggregateData(AppointmentModel, { _id: new mongoose.Types.ObjectId(id) }, projection);

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
export const deleteAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
