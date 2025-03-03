import { Request, Response, NextFunction } from "express";
import { AppointmentModel } from "../../../models/appointments";
import UserModel from "../../../models/users";

export const getNurseDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 🔹 Extract nurse ID from authenticated user
    const user = req.user as { id?: string };
    const nurseId = user?.id;

    if (!nurseId) {
      req.apiStatus = {
        isSuccess: false,
        error: { statusCode: 401, message: "Unauthorized" },
      };
      return next();
    }

    // 🔹 Check if the nurse account exists and is active
    const nurse = await UserModel.findById(nurseId);
    if (!nurse || nurse.isDeleted || nurse.isEnabled === false) {
      req.apiStatus = {
        isSuccess: false,
        error: { statusCode: 403, message: "Access Denied" },
      };
      return next();
    }

    // 🔹 Aggregate appointments to count unique patients for the nurse
    const result = await AppointmentModel.aggregate([
      { $match: { nurseId } }, // Filter by nurseId
      { $group: { _id: "$patientId" } }, // Get unique patient IDs
      { 
        $group: { 
          _id: null, 
          totalPatients: { $sum: 1 } // Count unique patients
        } 
      },
      { $project: { _id: 0, totalPatients: 1 } } // Only return totalPatients
    ]);

    // 🔹 If no patients found, return 0
    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: { totalPatients: result.length > 0 ? result[0].totalPatients : 0 },
    };
    next();
  } catch (error) {
    console.error("Error fetching nurse dashboard data:", error);
    req.apiStatus = {
      isSuccess: false,
      error: { statusCode: 500, message: "Something went wrong" },
    };
    next();
  }
};
