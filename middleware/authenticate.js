import { UnauthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid!");
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { userId: payload.id };
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid!");
  }

  next();
};

export default auth;
