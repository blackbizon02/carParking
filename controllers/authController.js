import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import attachCookie from "../utils/attachCookie.js";
import connectDb from "../database/connectDatabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import jsDateToMysqlDatetime from "../utils/jsDateToMysqlDaterime.js";
import sendResetPasswordEmail from "../utils/sendResetPasswordEmail.js";

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new BadRequestError("Please provide all values!");
  }

  let q = "SELECT * FROM users WHERE email = ?";

  const [emailAlreadyExists] = await connectDb.query(q, [email], err => {
    if (err) throw new err;
  });

  if (emailAlreadyExists.length) {
    throw new BadRequestError("Email already exists!");
  }

  q = "INSERT INTO users (`username`, `email`, `password`) VALUE (?)";

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const values = [username, email, hashedPassword];

  await connectDb.query(q, [values], (err) => {
    if (err)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
  });

  res.status(StatusCodes.CREATED).json({ msg: "User created!" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values!");
  }

  let q = "SELECT * FROM users WHERE email = ?";

  const [user] = await connectDb.query(q, [email]);
  console.log(user);

  if (!user.length) {
    throw new UnauthenticatedError("Invalid credentials!");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user[0].password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials!");
  }

  const token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  user[0].password = undefined;
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json(user[0]);
};

const logoutUser = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expiresIn: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide valid email!");
  }

  let q = "SELECT * FROM users WHERE email = ?";

  const [user] = await connectDb.query(q, [email]);

  if (!user.length) {
    throw new UnauthenticatedError("Invalid email!");
  }

  if (user.length) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const tenMinute = 1000 * 60 * 10;
    const passwordTokenExpirationDate = jsDateToMysqlDatetime(
      new Date(Date.now() + tenMinute)
    );

    q =
      "UPDATE users SET passwordToken = ?, passwordTokenExpirationDate = ? WHERE email = ?";

    await connectDb.query(q, [
      passwordToken,
      passwordTokenExpirationDate,
      email,
    ]);
    console.log(user[0]);

    await sendResetPasswordEmail({
      name: user[0].username,
      email: user[0].email,
      token: passwordToken,
      origin: process.env.ORIGIN,
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link!" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!email || !token || !password) {
    throw new BadRequestError("Please provide all credentials!");
  }

  let q =
    "SELECT passwordToken, passwordTokenExpirationDate FROM users WHERE email = ?";

  const [user] = await connectDb.query(q, [email]);

  if (user[0]) {
    const currDate = new Date(Date.now());

    if (
      user[0].passwordToken === token &&
      user[0].passwordTokenExpirationDate > currDate
    ) {
      q =
        "UPDATE users SET password = ?, passwordToken = null, passwordTokenExpirationDate = null WHERE email = ?";

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      await connectDb.query(q, [hashedPassword, email]);
    }
  }

  res.status(StatusCodes.OK).json({ msg: "Success! Password recovered!" });
};

export { register, login, forgotPassword, resetPassword, logoutUser };
