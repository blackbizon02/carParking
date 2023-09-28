import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "mohammad26@ethereal.email",
    pass: "YTS5Ghp1Rz3pVp4Tn5",
  }
});

export default transporter;
