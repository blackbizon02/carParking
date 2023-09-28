import express from "express";
const router = express.Router();

import {
  getAllParkingSpaces,
  addParkingSpace,
  deleteParkingSpace,
  updateParkingSpace,
} from "../controllers/parkingController.js";

router.route("/getParkingSpaces").get(getAllParkingSpaces);
router.route("/addParkingSpace").post(addParkingSpace);
router.route("/deleteParkingSpace/:id").delete(deleteParkingSpace);
router.route("/updateParkingSpace/:id").post(updateParkingSpace);

export default router;
