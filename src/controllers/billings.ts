import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BillingModel } from "../models/billings";
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

    const { totalCount, tableData } = await aggregateData(
      BillingModel,
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
      data: {
        totalCount,
        tableData,
      },
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
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
      res.status(400).json({ status: 400, message: "Invalid billing ID" });
      return;
    }

    // Determine if projection includes fields (1 for inclusion, 0 for exclusion)
    const isInclusionProjection = Object.values(projection).includes(1);

    // Fetch the bill with correct projection
    const bill = await BillingModel.findOne(
      { _id: id, isDeleted: false },
      isInclusionProjection ? { ...projection } : { ...projection, isDeleted: 0 } // Ensure no mixed 1s and 0s
    );

    if (!bill) {
      res.status(404).json({ status: 404, message: "Billing record not found or deleted" });
      return;
    }

    // Convert to object and remove `isDeleted`
    const billObj = bill.toObject();
    delete billObj.isDeleted;

    res.status(200).json({
      status: 200,
      message: "Success",
      data: billObj,
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};
