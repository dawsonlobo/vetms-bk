import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BillingModel } from "../../../models/billings";
import { aggregateData } from "../../../utils/aggregation";
import { CONSTANTS } from "../../../config/constant";
import { ErrorCodes } from "../../../models/models";

export const upsertBilling = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { _id, ...billingData } = req.body;

    if (_id) {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1002],
          toastMessage: "Invalid Billing ID provided",
        };
        return next();
      }

      const existingBilling = await BillingModel.findById(_id).exec();
      if (!existingBilling) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1002],
          toastMessage: "Billing record not found",
        };
        return next();
      }

      const updatedBilling = await BillingModel.findByIdAndUpdate(
        _id,
        billingData,
        { new: true },
      ).exec();

      req.apiStatus = {
        isSuccess: true,
        message: "Billing record updated successfully",
        data: updatedBilling || {},
        toastMessage: "Billing record updated successfully",
      };
    } else {
      const newBilling = await new BillingModel(billingData).save();

      req.apiStatus = {
        isSuccess: true,
        message: "Billing record created successfully",
        data: newBilling,
        toastMessage: "Billing record created successfully",
      };
    }
  } catch (error) {
    console.error("Error in upsertBilling:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1010],
      toastMessage: "Something went wrong. Please try again.",
    };
  }
  next();
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

    const lookups = req.body?.lookupRequired
      ? [
          {
            $lookup: {
              from: CONSTANTS.COLLECTIONS.PATIENTS_COLLECTION,
              localField: "patientId",
              foreignField: "_id",
              as: "patientDetails",
            },
          },
          {
            $unwind: {
              path: "$patientDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: CONSTANTS.COLLECTIONS.USER_COLLECTION,
              localField: "doctorId",
              foreignField: "_id",
              as: "doctorDetails",
            },
          },
          {
            $unwind: {
              path: "$doctorDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]
      : [];

    const { totalCount, tableData } = await aggregateData(
      BillingModel,
      filter,
      projection,
      options,
      search,
      date,
      fromDate,
      toDate,
      lookups,
    );

    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: { totalCount, tableData },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      toastMessage: "Something went wrong. Please try again.",
    };
  }
  next();
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
      };
      return next();
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const { tableData } = await aggregateData(
      BillingModel,
      { _id: objectId, isDeleted: false },
      projection,
    );

    if (!tableData || tableData.length === 0) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
      };
      return next();
    }

    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: tableData[0],
    };
  } catch (error) {
    console.error("Error fetching bill:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1010],
    };
  }
  next();
};
