import { Request, Response, NextFunction } from "express";
import { PaymentModel } from "../models/payments"; // Import the Patient model
import mongoose, { SortOrder } from "mongoose";
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      projection = {}, // Fields to return
      filter = {}, // Query filters
      options = {}, // Pagination & sorting options
      pagination = {}, // Page & limit
      search = [], // Search terms
      date, // Specific date filter
      fromDate, // Date range start
      toDate, // Date range end
    } = req.body;
    
    let query: any = { isDeleted: false, ...filter }; // Ensure soft-deleted items are excluded
    
    // Handle date filtering
    if (date) {
      query.createdAt = { $eq: new Date(date * 1000) }; // Convert epoch to date
    } else if (fromDate && toDate) {
      query.createdAt = {
        $gte: new Date(fromDate * 1000),
        $lte: new Date(toDate * 1000),
      };
    }
    
    // Handle search logic
    if (search.length > 0) {
      const searchQueries = search.map(({ term, fields, startsWith }: any) => ({
        $or: fields.map((field: string) => ({
          [field]: startsWith ? new RegExp(`^${term}`, 'i') : new RegExp(term, 'i'),
        })),
      }));
      query.$and = query.$and ? [...query.$and, ...searchQueries] : searchQueries;
    }
    
    // Handle pagination & sorting
    const { page = 1, itemsPerPage = 10, sortBy = ['createdAt'], sortDesc = [true] } = options;
    const sort: any = {};
    sortBy.forEach((field: string, index: number) => {
      sort[field] = sortDesc[index] ? -1 : 1;
    });
    
    // Get total count before pagination
    const totalCount = await PaymentModel.countDocuments(query);
    
    // Handle projection properly
    let finalProjection: any = {};
    
    // if (Object.keys(projection).length > 0) {
    //   // If specific fields are requested, use them but ensure isDeleted isn't included
    //   // Check if it's an inclusion projection (values are 1)
    //   const isInclusionProjection = Object.values(projection).some(value => value === 1);
      
    //   if (isInclusionProjection) {
    //     // For inclusion, copy all fields except isDeleted
    //     finalProjection = { ...projection };
    //     delete finalProjection.isDeleted;
    //   } else {
    //     // For exclusion, make sure isDeleted is excluded
    //     finalProjection = { ...projection, isDeleted: 0 };
    //   }
    // } else {
    //   // If no projection specified, return all fields except isDeleted
    //   finalProjection = { isDeleted: 0 };
    // }
    if (Object.keys(projection).length > 0) {
        finalProjection = { ...projection, appointmentId: 1 }; // Ensure inclusion
        delete finalProjection.isDeleted;
      } else {
        finalProjection = { appointmentId: 1, isDeleted: 0 }; // Default projection
      }
      
    
    // Fetch paginated results
    const tableData = await PaymentModel.find(query, finalProjection)
      .sort(sort)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: {
        totalCount,
        tableData,
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { projection } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ status: 400, message: "Invalid payment  ID" });
            return;
        }

        let projectionFields: any = projection || {};

        // If project is an inclusion projection, remove isDeleted exclusion
        const isInclusionProjection = Object.keys(projectionFields).length > 0 && !("_id" in projectionFields && projectionFields["_id"] === 0);

        if (!isInclusionProjection) {
            projectionFields.isDeleted = 0; // Only exclude if no inclusion fields are specified
        }

        // 🛑 Ensure isDeleted: false in the query to prevent fetching deleted records
        const appointment = await PaymentModel.findOne({ _id: id, isDeleted: false }, projectionFields);

        if (!appointment) {
            res.status(404).json({ status: 404, message: "payment not found or deleted" });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "Success",
            data: appointment,
        });
    } catch (error) {
        console.error("Error fetching patients", error);
        res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
    }
};
