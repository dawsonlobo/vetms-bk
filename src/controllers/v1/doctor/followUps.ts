import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { FollowUp} from "../../../models/followUps"; // Import Appointment model
import { aggregateData } from "../../../utils/aggregation";
import UserModel from "../../../models/users"
import {PatientModel} from "../../../models/patients"
import { ObjectId } from "mongodb";





export async function createFollowUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { patientId, doctorId, diagnosis, treatment, prescription, visitDate, } = req.body;
            console.log(doctorId);
            
            const existingUser = await UserModel.findOne({_id: new ObjectId(doctorId)});
            console.log(existingUser);

        if (!existingUser) {
            res.status(404).json({ message: "Doctor not found" });
            return;
        }

        if (existingUser.role !== "DOCTOR") {
            res.status(403).json({ message: "User is not authorized as a doctor" });
            return;
        }
        const existingPatient = await PatientModel.findOne({_id: new ObjectId(patientId)});;

        if (!existingPatient) {
            res.status(404).json({ message: "Patient not found" });
            return;
        }
        
        const newFollowUp = new FollowUp({
            patientId,
            doctorId,
            diagnosis,
            treatment,
            prescription,
            visitDate
        })
        await newFollowUp.save();

        res.status(200).json({
            status: 200,
            message: "Success",
            data: newFollowUp, // Only includes fields from projection
          });


    }  catch (error) {
        console.error("Error fetching FollowUp record:", error);
        res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          error,
        });
    }
}



export async function getAll  (req: Request, res: Response, next: NextFunction): Promise<void> {
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
      FollowUp,
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
      res.status(400).json({ status: 400, message: "Invalid FollowUp ID" });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(id); //  Convert string to ObjectId

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




export async function deleteFollowUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ status: 400, message: "Invalid FollowUp ID" });
            return;
        }

        // Check if FollowUp record exists
        const followup = await FollowUp.findById(id);

        if (!followup) {  // Fixed: Properly handle the null case
            res.status(404).json({ status: 404, message: "FollowUp record not found or deleted" });
            return;
        }

        if (followup.isDeleted) {
            res.status(404).json({ status: 404, message: "FollowUp record already deleted" });
            return;
        }

        // Perform soft delete
        followup.isDeleted = true;
        await followup.save();

        res.status(200).json({
            status: 200,
            message: "Success",
            data: "Follow-up deleted successfully",
            toastMessage: "Follow-up deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting FollowUp record:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error,
        });
    }
}
