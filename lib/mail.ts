import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendNotificationEmail = async (name: string, email: string, message: string) => {
  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL, // Your personal email to receive notifications
    replyTo: email,
    subject: `New Portfolio Contact Message from ${name}`,
    html: `
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">
        ${message}
      </blockquote>
    `,
  };

  await transporter.sendMail(mailOptions);
};