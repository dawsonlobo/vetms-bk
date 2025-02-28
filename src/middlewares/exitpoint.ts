import { Request, Response, RequestHandler } from "express";
import { ResponseObj } from "../models/models";
import { IUser } from "../models/users";
import { ObjectId } from "bson";
import logger from "../logger/v1/logger";
type bodyType = string | object | object[];
//import { User } from "../model/user"; // Adjust import as per your project structure

interface IData {
  body?: bodyType;
  query?: bodyType;
  params?: bodyType;
  response?: bodyType;
  txId?: string;
  path?: string;
  token?: string;
  userId?: string | ObjectId;
}

/**
 *
 * @param req
 * @param res
 */
export const exitPoint: RequestHandler = (req: Request, res: Response) => {
  const txId: string = req.txId ?? "";
  const path = req.baseUrl + req.url;
  const reqData: IData = {
    txId: txId,
    path: path,
  };

  // Include body, query, and params if they exist
  if (req.body) {
    reqData.body = req.body;
  }
  if (req.query) {
    reqData.query = req.query;
  }
  if (req.params) {
    reqData.params = req.params;
  }
  if (req.user) {
    req.user = JSON.parse(JSON.stringify(req.user));
    const user: IUser = req.user as IUser;
    reqData.userId = String(user._id);
  }

  // Token
  const authorizationHeader = req.headers.authorization ?? "";
  const parts = authorizationHeader.split(" ");

  let token: string;
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    token = parts[1];
    reqData.token = token;
  } else {
    logger?.info("Authorization header is not in the expected format");
  }

  reqData.response = req?.apiStatus?.data;

  JSON.stringify(reqData);

  if (req.apiStatus?.data) 
    {
    if (req?.apiStatus?.isSuccess) {
      const responseObj = new ResponseObj(
        200,
        "Success",
        req.apiStatus.data,
        req.apiStatus.toastMessage
      );
      res.status(responseObj.status).json(responseObj);
    } else {
      const responseObj = new ResponseObj(
        req.apiStatus?.error?.statusCode ?? 500,
        req.apiStatus?.error?.message ?? "Unknown error",
        req.apiStatus?.data,
        req.apiStatus?.toastMessage
      );
      res.status(responseObj.status).json(responseObj);
    }
  }
};
