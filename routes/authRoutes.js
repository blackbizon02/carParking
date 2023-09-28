import express from "express";
const router = express.Router();
import rateLimiter from "express-rate-limit";

import {
  register,
  login,
  forgotPassword,
  resetPassword,
  logoutUser,
} from "../controllers/authController.js";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes"
})

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);
router.route("/logoutUser").get(logoutUser);

export default router;
