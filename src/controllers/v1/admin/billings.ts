import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BillingModel } from "../../../models/billings";
import { aggregateData } from "../../../utils/aggregation";
import {CONSTANTS } from "../../../config/constant"
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

    const lookups = req.body?.lookupRequired ? [
      {
        $lookup: {
          from: CONSTANTS.COLLECTIONS.PATIENTS_COLLECTION, // Lookup patient details
          localField: "patientId",
          foreignField: "_id",
          as: "patientDetails"
        }
      },
      { 
        $unwind: { path: "$patientDetails", preserveNullAndEmptyArrays: true } 
      },
      {
        $lookup: {
          from: CONSTANTS.COLLECTIONS.USER_COLLECTION, // Lookup doctor details
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorDetails"
        }
      },
      { 
        $unwind: { path: "$doctorDetails", preserveNullAndEmptyArrays: true } 
      },
      {
        $lookup: {
          from: CONSTANTS.COLLECTIONS.USER_COLLECTION, // Lookup receptionist details
          localField: "receptionistId",
          foreignField: "_id",
          as: "receptionistDetails"
        }
      },
      { 
        $unwind: { path: "$receptionistDetails", preserveNullAndEmptyArrays: true } 
      }
    ] : [];

    // Now, call aggregateData only once
    const { totalCount, tableData } = await aggregateData(
      BillingModel,
      filter,
      projection,
      options,
      search,
      date,
      fromDate,
      toDate,
      lookups
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
      res.status(400).json({ status: 400, message: "Invalid billing ID" });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(id); // ✅ Convert string to ObjectId

    // Fetch bill using aggregateData
    const { tableData } = await aggregateData(BillingModel, { _id: objectId, isDeleted: false }, projection);

    if (!tableData || tableData.length === 0) {
      res.status(404).json({ status: 404, message: "Billing record not found or deleted" });
      return;
    }

    const billObj = tableData[0];

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