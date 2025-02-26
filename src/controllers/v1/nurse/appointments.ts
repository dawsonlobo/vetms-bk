import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { aggregateData } from "../../../utils/aggregation";

export const createUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as { _id?: string }; // Ensure user type
        if (!user?._id) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }

        const { _id, ...appointmentData } = req.body;

        if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
            res.status(400).json({ status: 400, message: "Invalid Appointment ID" });
            return;
        }

        const isUpdate = Boolean(_id);
        let appointment;

        if (isUpdate) {
            appointment = await AppointmentModel.findOneAndUpdate(
                { _id, nurseId: user._id }, // Ensure the nurse is assigned
                appointmentData,
                { new: true }
            ).exec();
        } else {
            appointment = await new AppointmentModel({ ...appointmentData, nurseId: user._id }).save();
        }

        if (!appointment) {
            res.status(404).json({ status: 404, message: "Appointment not found or unauthorized" });
            return;
        }

        res.status(200).json({
            status: 200,
            message: isUpdate ? "Appointment updated successfully" : "Appointment added successfully",
        });
    } catch (error) {
        console.error("Error in createUpdate:", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user as { _id?: string };
        if (!user?._id) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
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
