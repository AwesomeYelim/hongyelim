import nodemailer from "nodemailer";

export const mailConfig = {
  service: "Gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS,
  },
};

export const transporter = nodemailer.createTransport(mailConfig);
