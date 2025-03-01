import { Model } from "mongoose";

export const aggregateData = async (
  model: Model<any>,
  filter: any = {},
  projection: any = {},
  options: any = {},
  search: any[] = [],
  date?: number,
  fromDate?: number,
  toDate?: number,
  lookups: any[] = [],
) => {
  let query: any = { isDeleted: false, ...filter };

  // Date Filtering
  if (date) {
    query.createdAt = { $eq: new Date(date * 1000) };
  } else if (fromDate && toDate) {
    query.createdAt = {
      $gte: new Date(fromDate * 1000),
      $lte: new Date(toDate * 1000),
    };
  }

  // Search Handling
  if (search.length > 0) {
    const searchQueries = search.map(({ term, fields, startsWith }: any) => ({
      $or: fields
        .filter((field: string) => typeof field === "string")
        .map((field: string) => {
          if (typeof term === "boolean" || typeof term === "number")
            return { [field]: term };
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          return {
            [field]: startsWith
              ? new RegExp(`^${escapedTerm}`, "i")
              : new RegExp(escapedTerm, "i"),
          };
        }),
    }));
    query.$and = query.$and ? [...query.$and, ...searchQueries] : searchQueries;
  }

  // Sorting & Pagination
  const {
    page = 1,
    itemsPerPage = 10,
    sortBy = ["createdAt"],
    sortDesc = [true],
  } = options;
  const sort: any = {};
  sortBy.forEach((field: string, index: number) => {
    sort[field] = sortDesc[index] ? -1 : 1;
  });

  // Projection
  let finalProjection: Record<string, number> = { isDeleted: 0 };

  if (Object.keys(projection).length > 0) {
    const isInclusionProjection = Object.values(projection).some(
      (value) => value === 1,
    );
    const isExclusionProjection = Object.values(projection).every(
      (value) => value === 0,
    );

    if (isInclusionProjection) {
      finalProjection = { ...projection };
    } else if (isExclusionProjection) {
      finalProjection = { ...projection, isDeleted: 0 };
    }

    // Remove any field that is explicitly set to `0`
    Object.keys(finalProjection).forEach((key) => {
      if (finalProjection[key] === 0) {
        delete finalProjection[key];
      }
    });
  }

  // Ensure `_id` is included if missing
  if (finalProjection._id === undefined) {
    finalProjection._id = 1;
  }

  // Aggregation Pipeline
  const pipeline: any[] = [{ $match: query }];

  // Add lookups directly without trying to destructure them
  if (Array.isArray(lookups) && lookups.length > 0) {
    pipeline.push(...lookups);
  }

  pipeline.push(
    { $sort: sort },
    {
      $facet: {
        totalCount: [{ $count: "count" }],
        tableData: [
          { $skip: (page - 1) * itemsPerPage },
          { $limit: itemsPerPage },
          { $project: finalProjection },
        ],
      },
    },
  );

  // Execute Aggregation
  const result = await model.aggregate(pipeline);
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const tableData = result[0]?.tableData || [];

  return { totalCount, tableData };
};
