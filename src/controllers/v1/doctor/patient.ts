import { Request, Response,NextFunction } from "express";
import mongoose from "mongoose";
import {PatientModel} from "../../../models/patients"
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";





export const getOne = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection = {} } = req.body;
    
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.apiStatus = {
        isSuccess: false,
        error:ErrorCodes[1002],
        message: "Invalid Appointment ID.",
        toastMessage: "Invalid Appointment ID.",
      };
      next();
         return;
      
    }

    const objectId = new mongoose.Types.ObjectId(id); // Convert string to ObjectId

    // Remove isDeleted from projection to ensure it's never included
    const sanitizedProjection = { ...projection };
    delete sanitizedProjection.isDeleted;

    // Fetch follow-up data using aggregation
    const { tableData } = await aggregateData(PatientModel, { _id: objectId, isDeleted: false }, sanitizedProjection);

    if (!tableData || tableData.length === 0) {
      req.apiStatus = {
        isSuccess: false,
        error:ErrorCodes[1002],
        message: "Patient record not found or deleted" ,
        toastMessage: "Patient record not found or deleted",
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
        PatientModel,
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
  }catch (error) {
      console.error("Error fetching data:", error);
      req.apiStatus = {
        isSuccess: false,
        error:ErrorCodes[1002],
        message: "Internal Server Error",
        toastMessage: "Internal Server Error",
      };
      next();
      return;
    }
};




export const Update = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      
        const{_id}=req.params;
        const { weight, bmi, medicalHistory } = req.body;
        

              const updateFields = { weight, bmi, medicalHistory };
              
            //   if (updateFields.isDeleted) {
            //     delete updateFields.isDeleted;
            // }

            const updatedPatients = await PatientModel.findByIdAndUpdate(_id, updateFields, { new: true });


            
            if (!updatedPatients) {
              req.apiStatus = {
                isSuccess: false,
                error:ErrorCodes[1002],
                message: "Patients record not found." ,
                toastMessage: "Patients record not found." ,
              };
              next();
                 return;
            }
            
            req.apiStatus = {
              isSuccess: true,
            message: "Success",
              data: "Appointment updated successfully",
              toastMessage: "Appointment updated successfully",
            };
            next();
            return;

    } catch (error) {
      console.error("Error fetching data:", error);
      req.apiStatus = {
        isSuccess: false,
        error:ErrorCodes[1002],
        message: "Internal Server Error",
        toastMessage: "Internal Server Error",
      };
      next();
      return;
    }
};
