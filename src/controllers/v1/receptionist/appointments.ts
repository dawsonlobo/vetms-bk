import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { aggregateData } from "../../../utils/aggregation";

export const createUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id, ...appointmentData } = req.body;

        if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
            res.status(400).json({
                status: 400,
                message: "Invalid Appointment ID",
                toastMessage: "Invalid Appointment ID provided",
            });
            return;
        }

        let isUpdate = Boolean(_id);
        let appointment;

        if (isUpdate) {
            appointment = await AppointmentModel.findByIdAndUpdate(_id, appointmentData, { new: true }).exec();
        } else {
            appointment = await new AppointmentModel(appointmentData).save();
        }

        if (!appointment) {
            res.status(404).json({
                status: 404,
                message: "Appointment not found",
                toastMessage: "Appointment record not found",
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "Success",
            data: isUpdate ? "Appointment record updated successfully" : "Appointment added successfully",
            toastMessage: isUpdate ? "Appointment record updated successfully" : "Appointment added successfully",
        });

    } catch (error) {
        console.error("Error in createUpdate:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
        });
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

    res.status(200).json({
      status: 200,
      message: "Success",
      data: { totalCount, tableData },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 400, message: "Invalid appointment ID" });
    }

    const result = await aggregateData(AppointmentModel, { _id: new mongoose.Types.ObjectId(id) }, projection);

    if (!result.tableData.length) {
      res.status(404).json({ status: 404, message: "Appointment not found or deleted" });
    }

    res.status(200).json({
      status: 200,
      message: "Success",
      data: result.tableData[0], // Access the first element of tableData
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error });
  }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                status: 400,
                message: "Invalid appointment ID",
                toastMessage: "Invalid appointment ID provided",
            });
            return;
        }

        const appointment = await AppointmentModel.findByIdAndDelete(id).exec();

        if (!appointment) {
            res.status(404).json({
                status: 404,
                message: "Appointment not found",
                toastMessage: "Appointment not found or already deleted",
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "Success",
            data: "Appointment deleted successfully",
            toastMessage: "Appointment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
        });
    }
};
