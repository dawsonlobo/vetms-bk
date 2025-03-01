"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateData = void 0;
var aggregateData = function (model_1) {
  var args_1 = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args_1[_i - 1] = arguments[_i];
  }
  return __awaiter(
    void 0,
    __spreadArray([model_1], args_1, true),
    void 0,
    function (
      model,
      filter,
      projection,
      options,
      search,
      date,
      fromDate,
      toDate,
      lookups,
    ) {
      var query,
        searchQueries,
        _a,
        page,
        _b,
        itemsPerPage,
        _c,
        sortBy,
        _d,
        sortDesc,
        sort,
        finalProjection,
        isInclusionProjection,
        isExclusionProjection,
        pipeline,
        result,
        totalCount,
        tableData;
      var _e, _f, _g;
      if (filter === void 0) {
        filter = {};
      }
      if (projection === void 0) {
        projection = {};
      }
      if (options === void 0) {
        options = {};
      }
      if (search === void 0) {
        search = [];
      }
      if (lookups === void 0) {
        lookups = [];
      }
      return __generator(this, function (_h) {
        switch (_h.label) {
          case 0:
            query = __assign({ isDeleted: false }, filter);
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
              searchQueries = search.map(function (_a) {
                var term = _a.term,
                  fields = _a.fields,
                  startsWith = _a.startsWith;
                return {
                  $or: fields
                    .filter(function (field) {
                      return typeof field === "string";
                    })
                    .map(function (field) {
                      var _a, _b;
                      if (typeof term === "boolean" || typeof term === "number")
                        return (_a = {}), (_a[field] = term), _a;
                      var escapedTerm = term.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&",
                      );
                      return (
                        (_b = {}),
                        (_b[field] = startsWith
                          ? new RegExp("^".concat(escapedTerm), "i")
                          : new RegExp(escapedTerm, "i")),
                        _b
                      );
                    }),
                };
              });
              query.$and = query.$and
                ? __spreadArray(
                    __spreadArray([], query.$and, true),
                    searchQueries,
                    true,
                  )
                : searchQueries;
            }
            (_a = options.page),
              (page = _a === void 0 ? 1 : _a),
              (_b = options.itemsPerPage),
              (itemsPerPage = _b === void 0 ? 10 : _b),
              (_c = options.sortBy),
              (sortBy = _c === void 0 ? ["createdAt"] : _c),
              (_d = options.sortDesc),
              (sortDesc = _d === void 0 ? [true] : _d);
            sort = {};
            sortBy.forEach(function (field, index) {
              sort[field] = sortDesc[index] ? -1 : 1;
            });
            finalProjection = { isDeleted: 0 };
            if (Object.keys(projection).length > 0) {
              isInclusionProjection = Object.values(projection).some(
                function (value) {
                  return value === 1;
                },
              );
              isExclusionProjection = Object.values(projection).every(
                function (value) {
                  return value === 0;
                },
              );
              if (isInclusionProjection) {
                finalProjection = __assign({}, projection);
              } else if (isExclusionProjection) {
                finalProjection = __assign(__assign({}, projection), {
                  isDeleted: 0,
                });
              }
              // Remove any field that is explicitly set to `0`
              Object.keys(finalProjection).forEach(function (key) {
                if (finalProjection[key] === 0) {
                  delete finalProjection[key];
                }
              });
            }
            // Ensure `_id` is included if missing
            if (finalProjection._id === undefined) {
              finalProjection._id = 1;
            }
            pipeline = [{ $match: query }];
            // Add lookups directly without trying to destructure them
            if (Array.isArray(lookups) && lookups.length > 0) {
              pipeline.push.apply(pipeline, lookups);
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
            return [4 /*yield*/, model.aggregate(pipeline)];
          case 1:
            result = _h.sent();
            totalCount =
              ((_f =
                (_e = result[0]) === null || _e === void 0
                  ? void 0
                  : _e.totalCount[0]) === null || _f === void 0
                ? void 0
                : _f.count) || 0;
            tableData =
              ((_g = result[0]) === null || _g === void 0
                ? void 0
                : _g.tableData) || [];
            return [
              2 /*return*/,
              { totalCount: totalCount, tableData: tableData },
            ];
        }
      });
    },
  );
};
exports.aggregateData = aggregateData;
