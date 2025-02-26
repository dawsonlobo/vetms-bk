import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { FollowUp} from "../../../models/followUps"; // Import Appointment model
import { aggregateData } from "../../../utils/aggregation";
import {CONSTANTS} from "../../../config/constant";
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
      }
    ] : [];

    // Now, call aggregateData only once
    const { totalCount, tableData } = await aggregateData(
      FollowUp,
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
      res.status(400).json({ status: 400, message: "Invalid FollowUp ID" });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(id); // ✅ Convert string to ObjectId

    // Ensure projection fields are properly formatted
    //const formattedProjection = Object.keys(projection).length ? projection : { _id: 1 }; // Default projection

    // Fetch follow-up data using aggregation
    const { tableData } = await aggregateData(FollowUp, { _id: objectId, isDeleted: false }, projection);

    if (!tableData || tableData.length === 0) {
      res.status(404).json({ status: 404, message: "FollowUp record not found or deleted" });
      return;
    }

    const followUpObj = tableData[0];

    res.status(200).json({
      status: 200,
      message: "Success",
      data: followUpObj, // Only includes fields from projection
    });
  } catch (error) {
    console.error("Error fetching FollowUp record:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};