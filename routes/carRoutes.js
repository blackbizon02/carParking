import express from "express";
const router = express.Router();

import {
  addCar,
  deleteCar,
  updateCar,
  getCars,
  bookParkingSpot,
} from "../controllers/carController.js";

router.route("/addCar").post(addCar);
router.route("/deleteCar/:id").delete(deleteCar);
router.route("/updateCar/:id").post(updateCar);
router.route("/getCars").get(getCars);
router.route("/bookParking").post(bookParkingSpot);

export default router;
