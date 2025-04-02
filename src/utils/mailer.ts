import User from "@/models/user.models";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }) => {
  const hashedToken = await bcryptjs.hash(userId.toString(), 10);

  if (emailType !== "VERIFY" && emailType !== "RESET") {
    throw new Error('Invalid email type. Use "verify" or "reset".');
  } else if (emailType === "VERIFY") {
    await User.findbyIdAndUpdate(userId, {
      verificationToken: hashedToken,
      verificationTokenExpiry: Date.now() + 3600000, // 1 hour
    });
  } else if (emailType === "RESET") {
    await User.findbyIdAndUpdate(userId, {
      resetToken: hashedToken,
      resetTokenExpiry: Date.now() + 3600000, // 1 hour
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
    html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
