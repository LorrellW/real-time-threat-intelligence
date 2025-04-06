// app/utils/alerts.server.ts
import nodemailer from "nodemailer";
import axios from "axios";

const WEBHOOK_URL = "https://your-webhook-url.com";

const transporter = nodemailer.createTransport({
  host: "smtp.your-email.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmailAlert(threat: string, riskScore: number) {
  const mailOptions = {
    from: "alerts@shopsmart.com",
    to: "admin@shopsmart.com",
    subject: "Critical Cybersecurity Alert",
    text: `High-Risk Threat Detected: ${threat} with Risk Score ${riskScore}`,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendWebhookAlert(threat: string, riskScore: number) {
  await axios.post(WEBHOOK_URL, { threat, risk_score: riskScore });
}
