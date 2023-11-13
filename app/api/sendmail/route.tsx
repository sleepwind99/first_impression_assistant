import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { htmlstr, sendTo } = await req.json();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWARD,
    },
  });
  try {
    const res = await transporter.sendMail({
      from: process.env.MAIL,
      to: sendTo,
      subject: "nodemailer test",
      html: htmlstr,
    });
    return NextResponse.json({ res });
  } catch (error) {
    console.error("Error sending email:", error);
    return new NextResponse("Failed to send email", {
      status: 500,
    });
  }
}
