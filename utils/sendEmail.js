import nodemailer from "nodemailer";
import transporter from "./nodemailerconfig.js";

const sendEmail = async ({ to, subject, html }) => {
    let testAccount = await nodemailer.createTestAccount();

  return transporter.sendMail({
    from: '"sweeft test" <testing@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

export default sendEmail;
