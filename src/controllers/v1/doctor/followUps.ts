import { Request, Response,NextFunction } from "express";
import mongoose from "mongoose";
import { FollowUp} from "../../../models/followUps"; // Import Appointment model
import { aggregateData } from "../../../utils/aggregation";
import UserModel from "../../../models/users"
import {PatientModel} from "../../../models/patients"
import { ObjectId } from "mongodb";
import { ErrorCodes } from "../../../models/models";





export async function createUpdateFollowUp(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
      const { _id, patientId, doctorId, diagnosis, treatment, prescription, visitDate, ...rest } = req.body;
      
      // Validate if doctor exists and has the correct role
      const existingUser = await UserModel.findOne({ _id: new ObjectId(doctorId) });

      
      if (!existingUser) {
        req.apiStatus = {
          isSuccess: false,
          error:ErrorCodes[1002],
          message:"Doctor not found",
          toastMessage: "Doctor not found",
        };
        next();
           return;
      }

      
      if (existingUser.role !== "DOCTOR") {
        req.apiStatus = {
          isSuccess: false,
          error:ErrorCodes[1002],
          message:"User is not authorized as a doctor" ,
          toastMessage: "User is not authorized as a doctor" ,
        };
        next();
           return;
      }

      // Validate if patient exists
      const existingPatient = await PatientModel.findOne({ _id: new ObjectId(patientId) });

      
      if (!existingPatient) {
        req.apiStatus = {
          isSuccess: false,
          error:ErrorCodes[1002],
          message: "Patient not found",
          toastMessage: "Patient not found",
        };
        next();
           return;
      }

      if (_id) {
          // Prepare update payload while ensuring `isDeleted` is never updated
          const updateFields = { patientId, doctorId, diagnosis, treatment, prescription, visitDate, ...rest };
          delete updateFields.isDeleted; // Explicitly remove `isDeleted`

          // If ID is provided, update existing follow-up
          const updatedFollowUp = await FollowUp.findByIdAndUpdate(_id, updateFields, { new: true });

          
          if (!updatedFollowUp) {
            req.apiStatus = {
              isSuccess: false,
              error:ErrorCodes[1002],
              message: "FollowUp record not found",
              toastMessage: "FollowUp record not found",
            };
            next();
               return;
          }

          
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "Follow-up updated successfully",
            toastMessage: "Follow-up updated successfully",
          };
          next();
          return;

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
          
          
          // "Follow-up created successfully",
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "Follow-up created successfully",
            toastMessage: "Follow-up created successfully",
          };
          next();
          return;
      }

  } catch (error) {
    console.error("Error fetching data:", error);
    req.apiStatus = {
      isSuccess: false,
      error:ErrorCodes[1002],
      message: "Internal Server Error",
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
    return;
  }
}






export async function getAll(req: Request, res: Response,next:NextFunction): Promise<void> {
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

    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: { totalCount, tableData },
      };
    next();
    return;
  } catch (error) {
    console.error("Error fetching data:", error);
    req.apiStatus = {
      isSuccess: false,
      error:ErrorCodes[1002],
      message: "Internal Server Error",
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
    return;
  }
};



export const getOne = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection = {} } = req.body;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.apiStatus = {
        isSuccess: false,
        error:ErrorCodes[1002],
        message: "Invalid FollowUp ID",
        toastMessage: "Invalid FollowUp ID",
      };
      next();
         return;
    }

    const objectId = new mongoose.Types.ObjectId(id); // Convert string to ObjectId

    // Remove isDeleted from projection to ensure it's never included
    const sanitizedProjection = { ...projection };
    delete sanitizedProjection.isDeleted;

    // Fetch follow-up data using aggregation
    const { tableData } = await aggregateData(FollowUp, { _id: objectId, isDeleted: false }, sanitizedProjection);

    
    if (!tableData || tableData.length === 0) {
      req.apiStatus = {
        isSuccess: false,
        error:ErrorCodes[1002],
        message: "FollowUp record not found or deleted",
        toastMessage: "FollowUp record not found or deleted",
      };
      next();
         return;
    }

    const followUpObj = tableData[0];
    // Only includes fields from sanitizedProjection
    
    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: followUpObj, 
      };
    next();
    return;
  } catch (error) {
    console.error("Error fetching data:", error);
    req.apiStatus = {
      isSuccess: false,
      error:ErrorCodes[1002],
      message: "Internal Server Error",
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
    return;
  }
};





export async function deleteFollowUp(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        // Validate ObjectId
        // "Invalid FollowUp ID"
        if (!mongoose.Types.ObjectId.isValid(id)) {
          req.apiStatus = {
            isSuccess: false,
            error:ErrorCodes[1002],
            message: "Enter a valid id",
            toastMessage: "Enter a valid id",
          };
          next();
             return;
        }

        // Check if FollowUp record exists
        const followup = await FollowUp.findById(id);

        
        if (!followup) {  // Fixed: Properly handle the null case
          req.apiStatus = {
            isSuccess: false,
            error:ErrorCodes[1002],
            message: "FollowUp record not found or deleted",
            toastMessage: "FollowUp record not found or deleted",
          };
          next();
             return;
        }

        
        if (followup.isDeleted) {
          req.apiStatus = {
            isSuccess: false,
            error:ErrorCodes[1002],
            message: "FollowUp record already deleted",
            toastMessage: "FollowUp record already deleted",
          };
          next();
             return;
        }

        // Perform soft delete
        followup.isDeleted = true;
        await followup.save();

        
        req.apiStatus = {
          isSuccess: true,
          message: "Success",
          data: "Follow-up deleted successfully",
          toastMessage: "Follow-up deleted successfully",
        };
        next();
        return;

    } catch (error) {
      console.error("Error fetching data:", error);
      req.apiStatus = {
        isSuccess: false,
        error:ErrorCodes[1002],
        message: "Internal Server Error",
        toastMessage: "Something went wrong. Please try again.",
      };
      next();
      return;
    }
}


