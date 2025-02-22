import { Model } from "mongoose";

export const aggregateData = async (
  model: Model<any>, // Mongoose model
  filter: any = {}, // Query filters
  projection: any = {}, // Fields to return
  options: any = {}, // Pagination & sorting options
  search: any[] = [], // Search terms
  date?: number, // Specific date filter (epoch)
  fromDate?: number, // Start date (epoch)
  toDate?: number // End date (epoch)
) => {
  let query: any = { isDeleted: false, ...filter }; // Soft delete filter

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
// Handle search logic
if (search.length > 0) {
  const searchQueries = search.map(({ term, fields, startsWith, endsWith }: any) => ({
    $or: fields.map((field: string) => {
      if (typeof term === "boolean" || typeof term === "number") {
        return { [field]: term }; // Direct match for boolean and number fields
      }

      // Handle startsWith, endsWith, and contains
      if (startsWith) {
        return { [field]: new RegExp(`^${term}`, "i") };
      } else if (endsWith) {
        return { [field]: new RegExp(`${term}$`, "i") };
      } else {
        return { [field]: new RegExp(term, "i") }; // Default: Contains
      }
    }),
  }));
  query.$and = query.$and ? [...query.$and, ...searchQueries] : searchQueries;
}


  // Handle sorting & pagination
  const { page = 1, itemsPerPage = 10, sortBy = ["createdAt"], sortDesc = [true] } = options;
  const sort: any = {};
  sortBy.forEach((field: string, index: number) => {
    sort[field] = sortDesc[index] ? -1 : 1;
  });

  // Handle projection properly
  let finalProjection: any = { isDeleted: 0 }; // Exclude isDeleted by default

  if (Object.keys(projection).length > 0) {
    const isInclusionProjection = Object.values(projection).some(value => value === 1);
    finalProjection = isInclusionProjection ? { ...projection } : { ...projection, isDeleted: 0 };
  }

  // Aggregation Pipeline
  const pipeline: any[] = [
    { $match: query }, // Apply filters
    { $sort: sort }, // Sorting
    {
      $facet: {
        totalCount: [{ $count: "count" }], // Get total count
        tableData: [
          { $skip: (page - 1) * itemsPerPage },
          { $limit: itemsPerPage },
          { $project: finalProjection }, // Projection
        ],
      },
    },
  ];

  // Execute aggregation
  const result = await model.aggregate(pipeline);
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const tableData = result[0]?.tableData || [];

  return { totalCount, tableData };
};