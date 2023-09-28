import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";
import morgan from "morgan";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";

import cookieParser from "cookie-parser";

//routers
import authRouter from "./routes/authRoutes.js";
import carRouter from "./routes/carRoutes.js";
import parkingRouter from "./routes/parkingRoutes.js";

//middleware
import notFoundMiddleWare from "./middleware/notFoundMiddleware.js";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import authenticateUser from "./middleware/authenticate.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authenticateUser, carRouter);
app.use("/api/v1/admin", authenticateUser, parkingRouter);

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
