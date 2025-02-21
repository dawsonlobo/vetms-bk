import { Request, Response, NextFunction } from 'express';
import { PatientModel } from '../models/patients'; // Import the Patient model
import mongoose, { SortOrder } from 'mongoose';

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.body) {
     res.status(400).json({ error: 'Request body is missing' });
    }

    const {
      filter = {},
      projection,
      options,
      pagination = {},
      search,
      date,
      fromDate,
      toDate,
    } = req.body;

    let query: any = filter;

    if (date) {
      query.createdAt = { $eq: new Date(date * 1000) };
    } else if (fromDate && toDate) {
      query.createdAt = { $gte: new Date(fromDate * 1000), $lte: new Date(toDate * 1000) };
    }

    if (search && Array.isArray(search)) {
      query.$or = search.flatMap(({ term, fields, startsWith }) =>
        fields.map((field: string) => ({
          [field]: { $regex: startsWith ? `^${term}` : term, $options: 'i' },
        }))
      );
    }

    const page = Math.max(1, pagination.page || 1);
    const itemsPerPage = Math.max(1, pagination.itemsPerPage || 10);
    const skip = (page - 1) * itemsPerPage;

    const sortOptions: { [key: string]: SortOrder } = options?.sortBy
      ? { [String(options.sortBy)]: options.sortDesc ? -1 : 1 }
      : {};

    const [totalCount, patientsList] = await Promise.all([
      PatientModel.countDocuments(query).exec(),
      PatientModel.find(query).select(projection).skip(skip).limit(itemsPerPage).sort(sortOptions).exec(),
    ]);

    res.status(200).json({
      status: 200,
      message: 'Success',
      data: { totalCount, tableData: patientsList },
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    next(error);
  }
};
// Adjust path as needed


// Ensure this path matches your project structure

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // Get patient ID from URL params

    // Step 1: Check if the patient exists
    const patient = await PatientModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id), isDeleted: false } },
      {
        $lookup: {
          from: 'PatientModel', // Assuming medical history is stored in 'medical_records' collection
          localField: '_id',
          foreignField: 'patientId',
          as: 'medicalHistory',
        },
      },
      {
        $unwind: { path: '$medicalHistory', preserveNullAndEmptyArrays: true }, // Unwind medical history if it exists
      },
      {
        $project: {
          _id: 1,
          name: 1,
          species: 1,
          breed: 1,
          age: 1,
          weight: 1,
          gender: 1,
          BMI: 1,
          bloodGroup: 1,
          createdAt: 1,
          updatedAt: 1,
          medicalHistory: { $ifNull: ['$medicalHistory.details', 'No medical history available'] },
        },
      },
    ]);

    if (!patient || patient.length === 0) {
       res.status(404).json({
        status: 404,
        message: 'Patient not found.',
      });
    }

    // Step 2: Respond with formatted patient data
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: patient[0], // Assuming only one patient is found with the given ID
    });
  } catch (error) {
    console.error('Error retrieving patient:', error);
    res.status(500).json({ status: 500, message: 'Internal server error', error });
  }
};
