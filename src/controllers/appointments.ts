import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../models/appointments"; // Import Appointment model
import { aggregateData } from "../utils/aggregation";


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
    console.error("Error fetching data:", error);
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
       res.status(400).json({ status: 400, message: "Invalid ID" });
    }

    const result = await aggregateData(AppointmentModel, { _id: new mongoose.Types.ObjectId(id) }, projection);

    if (!result.tableData.length) {
      res.status(404).json({ status: 404, message: "Record not found or deleted" });
    }

    res.status(200).json({
      status: 200,
      message: "Success",
      data: result.tableData[0], // Access the first element of tableData
    });
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
};
