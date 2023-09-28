import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import connectDb from "../database/connectDatabase.js";
import jsDateToMysqlDatetime from "../utils/jsDateToMysqlDaterime.js"

const addCar = async (req, res) => {
  const { carName, carNumber, type } = req.body;

  if (!carName || !carNumber || !type) {
    throw new BadRequestError("Provide all values!");
  }

  let q = "SELECT * FROM cars WHERE carNumber = ?";

  const [car] = await connectDb.query(q, [carNumber]);

  if (car.length) {
    throw new BadRequestError("Car already exists!");
  }

  q = "INSERT INTO cars (`userId`,`carName`,`carNumber`,`type`) VALUES (?)";

  const values = [req.user.userId, carName, carNumber, type];

  await connectDb.query(q, [values]);

  res.status(StatusCodes.CREATED).json({ msg: "Car created!" });
};

const deleteCar = async (req, res) => {
  const carId = req.params.id;

  let q = "SELECT * FROM cars WHERE id = ?";

  const [car] = await connectDb.query(q, [carId]);

  if (!car.length) {
    throw new BadRequestError("Car does not exist!");
  }

  q = "DELETE FROM cars WHERE `id` = ? AND `userId` = ?";

  await connectDb.query(q, [carId, req.user.userId]);

  res.status(StatusCodes.OK).json({ msg: "Car successfully deleted!" });
};

const updateCar = async (req, res) => {
  const { carName, carNumber, type } = req.body;

  if (!carName || !carNumber || !type) {
    throw new BadRequestError("Provide all values!");
  }
  const id = req.params.id;
  let q = "SELECT * FROM cars WHERE id = ?";

  const [car] = await connectDb.query(q, [id]);

  if (!car.length) {
    throw new BadRequestError("Car does not exist!");
  }

  q = "UPDATE cars SET carName = ?, carNumber = ?, type = ? WHERE id = ?";

  await connectDb.query(q, [carName, carNumber, type, id]);

  res.status(StatusCodes.OK).json({ msg: "Car info updated!" });
};

const getCars = async (req, res) => {
  const id = req.user.userId;
  // const q = "SELECT * FROM cars WHERE userId = ?";
  const q = "SELECT cars.*, bookParking.* FROM cars JOIN bookParking ON cars.id = bookParking.carId WHERE cars.userId = ?"

  const [cars] = await connectDb.query(q, [id]);

  res.status(StatusCodes.OK).json(cars);
};

const bookParkingSpot = async (req, res) => {
  const { parkingId, carId, hour } = req.body;
  const userId = req.user.userId
  
  let q = "SELECT bookParking.*, parkingSpaces.price FROM bookParking JOIN parkingSpaces ON bookParking.parkingId = parkingSpaces.id WHERE parkingSpaces.id = ? ORDER BY bookParking.finishingAt DESC"

  const [parkingSpots] = await connectDb.query(q, [parkingId])

  if(parkingSpots[0].finishingAt && parkingSpots[0].finishingAt > new Date(Date.now())) {
    throw new BadRequestError("Parking spot booked")
  }
  let jsHour = hour * 1000 * 60 * 60;
  const price = parkingSpots[0].price * hour;

  q = "INSERT INTO bookParking (`parkingId`,`userId`,`carId`,`createdAt`,`finishingAt`) VALUES (?)"

  const values = [
    parkingId,
    userId,
    carId,
    jsDateToMysqlDatetime(new Date(Date.now())),
    jsDateToMysqlDatetime(new Date(Date.now() + jsHour))
  ]

  await connectDb.query(q,[values])

  q = "SELECT balance FROM users WHERE id = ?"

  const [balance] = await connectDb.query(q,[userId])
  const newBalance = balance[0].balance - price
  q = "UPDATE users SET balance = ?";

  await connectDb.query(q,[newBalance])

  res.status(StatusCodes.CREATED).json("Your car has been added to parking spot!")
};

export { addCar, deleteCar, updateCar, getCars, bookParkingSpot };
