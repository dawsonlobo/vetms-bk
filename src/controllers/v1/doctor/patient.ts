import { Request, Response,NextFunction } from "express";
import mongoose from "mongoose";
import {PatientModel} from "../../../models/patients"
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";




export const getOne = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection} = req.body;
    
    
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


export async function Update  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    console.log("this is update controller");
    console.log("Request Params:", req.params);

    const { id } = req.params;
    console.log("Received ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        data: "Invalid patient ID format.",
        toastMessage: "Invalid patient ID format.",
      };
      next();
      return;
    }

    const { weight, bmi, medicalHistory } = req.body;

    const existingUser = await PatientModel.findById(id); // No need for `new ObjectId(id)`
    console.log("Existing User:", existingUser);

    if (!existingUser) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        data: "Patient record not found.",
        toastMessage: "Patient record not found.",
      };
      next();
      return;
    }

    // ✅ Use `findByIdAndUpdate` instead of `findById`
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      { weight, bmi, medicalHistory },
      { new: true }
    );

    console.log("Updated Patient:", updatedPatient);

    if (!updatedPatient) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        data: "Error updating patient record.",
        toastMessage: "Error updating patient record.",
      };
      next();
      return;
    }

    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: "Patient updated successfully",
      toastMessage: "Patient updated successfully",
    };
    next();
  } catch (error) {
    console.error("Error updating data:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      message: "Internal Server Error",
      toastMessage: "Internal Server Error",
    };
    next();
  }
};



// export const Update = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
//     try {
//       console.log("this is update controller");
      
      
//       const{id}=req.params;
//       console.log(id);
//         const { weight, bmi, medicalHistory } = req.body;
//      const existingUser = await PatientModel.findOne({ _id: new ObjectId(id) });

//         console.log(id);
//         console.log(existingUser);

//               const updateFields = { weight, bmi, medicalHistory };
              
//             //   if (updateFields.isDeleted) {
//             //     delete updateFields.isDeleted;
//             // }

//             const updatedPatients = await PatientModel.findById(new mongoose.Types.ObjectId(id), updateFields, { new: true });

//             console.log(updatedPatients);
            


            
//             if (!updatedPatients) {
//               req.apiStatus = {
//                 isSuccess: false,
//                 error:ErrorCodes[1002],
//                 data: "Patients record not found." ,
//                 toastMessage: "Patients record not found." ,
//               };
//               next();
//                  return;
//             }
            
//             req.apiStatus = {
//               isSuccess: true,
//             message: "Success",
//               data: "Appointment updated successfully",
//               toastMessage: "Appointment updated successfully",
//             };
//             next();
//             return;

//     } catch (error) {
//       console.error("Error fetching data:", error);
//       req.apiStatus = {
//         isSuccess: false,
//         error:ErrorCodes[1002],
//         message: "Internal Server Error",
//         toastMessage: "Internal Server Error",
//       };
//       next();
//       return;
//     }
// };



