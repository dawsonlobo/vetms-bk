import { Request, Response, NextFunction } from "express";
import { PaymentModel } from "../../../models/payments"; // Import the Patient model
import mongoose, { SortOrder } from "mongoose";
import { aggregateData } from "../../../utils/aggregation";
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
      PaymentModel,
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
    const { projection = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 400, message: "Invalid Payment ID" });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(id); // ✅ Convert string to ObjectId

    // Fetch payment using aggregateData
    const { tableData } = await aggregateData(PaymentModel, { _id: objectId, isDeleted: false }, projection);

    if (!tableData || tableData.length === 0) {
      res.status(404).json({ status: 404, message: "Payment record not found or deleted" });
      return;
    }

    const paymentObj = tableData[0];

    res.status(200).json({
      status: 200,
      message: "Success",
      data: paymentObj,
    });
  } catch (error) {
    console.error("Error fetching Payment record:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

