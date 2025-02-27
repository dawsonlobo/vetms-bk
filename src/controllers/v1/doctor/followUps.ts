import { Request, Response } from "express";
import mongoose from "mongoose";
import { FollowUp} from "../../../models/followUps"; // Import Appointment model
import { aggregateData } from "../../../utils/aggregation";
import UserModel from "../../../models/users"
import {PatientModel} from "../../../models/patients"
import { ObjectId } from "mongodb";




export async function createUpdateFollowUp(req: Request, res: Response): Promise<void> {
  try {
      const { _id, patientId, doctorId, diagnosis, treatment, prescription, visitDate, ...rest } = req.body;
      
      // Validate if doctor exists and has the correct role
      const existingUser = await UserModel.findOne({ _id: new ObjectId(doctorId) });

      if (!existingUser) {
          res.status(404).json({ message: "Doctor not found" });
          return;
      }

      if (existingUser.role !== "DOCTOR") {
          res.status(403).json({ message: "User is not authorized as a doctor" });
          return;
      }

      // Validate if patient exists
      const existingPatient = await PatientModel.findOne({ _id: new ObjectId(patientId) });

      if (!existingPatient) {
          res.status(404).json({ message: "Patient not found" });
          return;
      }

      if (_id) {
          // Prepare update payload while ensuring `isDeleted` is never updated
          const updateFields = { patientId, doctorId, diagnosis, treatment, prescription, visitDate, ...rest };
          delete updateFields.isDeleted; // Explicitly remove `isDeleted`

          // If ID is provided, update existing follow-up
          const updatedFollowUp = await FollowUp.findByIdAndUpdate(_id, updateFields, { new: true });

          if (!updatedFollowUp) {
              res.status(404).json({ status: 404, message: "FollowUp record not found" });
              return;
          }

          res.status(200).json({
              status: 200,
              message: "Success",
              data: "Follow-up updated successfully",
              toastMessage: "Follow-up updated successfully",
          });

      } else {
          // If no ID is provided, create a new follow-up record
          const newFollowUp = new FollowUp({
              patientId,
              doctorId,
              diagnosis,
              treatment,
              prescription,
              visitDate
          });

          await newFollowUp.save();

          res.status(201).json({
              status: 201,
              message: "Success",
              data: "Follow-up created successfully",
              toastMessage: "Follow-up created successfully",
          });
      }

  } catch (error) {
      console.error("Error in createUpdateFollowUp:", error);
      res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          error,
      });
  }
}






export async function getAll(req: Request, res: Response): Promise<void> {
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

    // Remove isDeleted from projection to ensure it's never included
    const sanitizedProjection = { ...projection };
    delete sanitizedProjection.isDeleted;

    // Ensure deleted records are not included in the filter
    const sanitizedFilter = { ...filter, isDeleted: false };

    // Call reusable aggregation function
    const { totalCount, tableData } = await aggregateData(
      FollowUp,
      sanitizedFilter,
      sanitizedProjection,
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



export const getOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 400, message: "Invalid FollowUp ID" });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(id); // Convert string to ObjectId

    // Remove isDeleted from projection to ensure it's never included
    const sanitizedProjection = { ...projection };
    delete sanitizedProjection.isDeleted;

    // Fetch follow-up data using aggregation
    const { tableData } = await aggregateData(FollowUp, { _id: objectId, isDeleted: false }, sanitizedProjection);

    if (!tableData || tableData.length === 0) {
      res.status(404).json({ status: 404, message: "FollowUp record not found or deleted" });
      return;
    }

    const followUpObj = tableData[0];

    res.status(200).json({
      status: 200,
      message: "Success",
      data: followUpObj, // Only includes fields from sanitizedProjection
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





export async function deleteFollowUp(req: Request, res: Response): Promise<void> {
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


