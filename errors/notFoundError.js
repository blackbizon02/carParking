import { StatusCodes } from "http-status-codes";
import CustomApiError from "./customApi.js";

export default class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    (this.statusCode = StatusCodes.NOT_FOUND);
  }
}