const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST  || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.EMAIL_USER) {
    console.log(`[EMAIL SKIP] To: ${to} | Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'BuildTrack CMS <noreply@buildtrack.com>',
    to, subject,
    html: html || `<p>${text}</p>`,
    text,
  });
};

const sendOTP = (to, otp) => sendEmail({
  to, subject: 'BuildTrack CMS — Password Reset OTP',
  html: `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#F7F9FC;border-radius:8px">
      <h2 style="color:#1B2A4A;margin-bottom:8px">Password Reset</h2>
      <p style="color:#64748b">Your OTP for password reset is:</p>
      <div style="font-size:36px;font-weight:700;color:#3A7BD5;letter-spacing:8px;margin:24px 0;text-align:center">${otp}</div>
      <p style="color:#64748b;font-size:12px">This OTP expires in 10 minutes. Do not share it with anyone.</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
      <p style="color:#94a3b8;font-size:11px">BuildTrack Construction Management System</p>
    </div>
  `,
});

const sendBudgetAlert = (to, projectName, percent) => sendEmail({
  to, subject: `⚠️ Budget Alert — ${projectName}`,
  html: `<p>Budget for <strong>${projectName}</strong> has reached <strong>${percent}%</strong> of the total budget.</p>`,
});

const sendCriticalIssue = (to, projectName, issueTitle) => sendEmail({
  to, subject: `🚨 Critical Issue — ${projectName}`,
  html: `<p>A critical issue has been reported on <strong>${projectName}</strong>: <strong>${issueTitle}</strong>. Please take immediate action.</p>`,
});

const sendDocumentExpiry = (to, docName, projectName, daysLeft) => sendEmail({
  to, subject: `📋 Document Expiry Alert — ${docName}`,
  html: `<p>Document <strong>${docName}</strong> on project <strong>${projectName}</strong> will expire in <strong>${daysLeft} days</strong>.</p>`,
});

module.exports = { sendEmail, sendOTP, sendBudgetAlert, sendCriticalIssue, sendDocumentExpiry };
