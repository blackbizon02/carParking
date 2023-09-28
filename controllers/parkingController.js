import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import connectDb from "../database/connectDatabase.js";

const getAllParkingSpaces = async (req, res) => {
  const q =
    "SELECT parkingSpaces.*, GROUP_CONCAT(bookParking.createdAt, bookParking.finishingAt) AS bookedCars FROM parkingSpaces LEFT JOIN bookParking ON parkingSpaces.id = bookParking.parkingId GROUP BY parkingSpaces.id";
  try {
    const [parkingSpaces] = await connectDb.query(q);
    console.log(parkingSpaces);

    res.status(StatusCodes.OK).json({ parkingSpaces });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

const addParkingSpace = async (req, res) => {
  const { name, address, price } = req.body;

  if (!name || !address || !price) {
    throw new BadRequestError("Provide all values!");
  }

  let q = "SELECT * FROM parkingSpaces WHERE name = ?";

  const [parkingSpace] = await connectDb.query(q, [name]);

  if (parkingSpace.length) {
    throw new BadRequestError("Parking space already exists!");
  }

  q = "INSERT INTO parkingSpaces (`name`,`address`,`price`) VALUES (?)";

  const values = [name, address, price];

  await connectDb.query(q, [values]);

  res.status(StatusCodes.CREATED).json({ msg: "Parking space created!" });
};

const deleteParkingSpace = async (req, res) => {
  const parkingSpaceId = req.params.id;

  let q = "SELECT * FROM parkingSpaces WHERE id = ?";

  const [parkingSpace] = await connectDb.query(q, [parkingSpaceId]);

  if (!parkingSpace.length) {
    throw new BadRequestError("parking space does not exist!");
  }

  q = "DELETE FROM parkingSpaces WHERE id = ?";

  await connectDb.query(q, [parkingSpaceId]);

  res
    .status(StatusCodes.OK)
    .json({ msg: "Parking space successfully deleted!" });
};

const updateParkingSpace = async (req, res) => {
  const { name, address, price } = req.body;
  const id = req.params.id;

  if (!name || !address || !price) {
    throw new BadRequestError("Provide all values!");
  }

  let q = "SELECT * FROM parkingSpaces WHERE id = ?";

  const [parkingSpace] = await connectDb.query(q, [id]);

  if (!parkingSpace.length) {
    throw new BadRequestError("Parking space does not exists!");
  }

  q = "UPDATE parkingSpaces SET name = ?, address = ?, price = ? WHERE id = ?";

  await connectDb.query(q, [name, address, price, id]);

  res.status(StatusCodes.CREATED).json({ msg: "Parking space updated!" });
};

export {
  getAllParkingSpaces,
  addParkingSpace,
  deleteParkingSpace,
  updateParkingSpace,
};
