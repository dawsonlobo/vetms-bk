import { Request, Response, NextFunction } from "express";
import { PatientModel } from "../../../models/patients";
import mongoose from "mongoose";
import { aggregateData } from "../../../utils/aggregation";

export const getAllForNurse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as { _id?: string };
    if (!user?._id) {
      res.status(401).json({ status: 401, message: "Unauthorized" });
      return;
    }

    const { projection = {}, filter = {}, options = {}, search = [], date, fromDate, toDate } = req.body;
    const nurseFilter = { ...filter, assignedNurseId: user._id }; // Ensure nurse sees only assigned patients

    const { totalCount, tableData } = await aggregateData(
      PatientModel,
      nurseFilter,
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
    console.error("Error fetching data:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

export const getOneForNurse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as { _id?: string };
    if (!user?._id) {
      res.status(401).json({ status: 401, message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { projection } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 400, message: "Invalid ID" });
      return;
    }

    const result = await aggregateData(
      PatientModel,
      { _id: new mongoose.Types.ObjectId(id), assignedNurseId: user._id },
      projection
    );

    if (!result.tableData.length) {
      res.status(404).json({ status: 404, message: "Record not found or unauthorized" });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Success",
      data: result.tableData[0],
    });
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error });
  }
};
