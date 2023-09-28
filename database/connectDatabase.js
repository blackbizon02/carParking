import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const connectDb = mysql
  .createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
  })
  .promise();

export default connectDb;
