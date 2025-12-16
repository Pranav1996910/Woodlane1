// File: pages/api/contact.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // --- ⚠️ IMPORTANT: CONFIGURE YOUR EMAIL SERVICE CREDENTIALS HERE ---
  // Use Environment Variables (e.g., process.env.EMAIL_USER) for security!
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Example: Use your email provider's SMTP server
    port: 465, // or 587
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your secure email login
      pass: process.env.EMAIL_PASS, // Your secure app password/key
    },
  });

  // --- Configure the Email Content ---
  const mailOptions = {
    from: `"${name}" <${email}>`, // Shows the user's name/email as the sender
    to: 'woodlanedoors@gmail.com', // ⬅️ The destination email address you requested
    subject: `New Contact Form Submission: ${subject}`,
    text: `
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      ----------------------------------
      Message: 
      ${message}
    `,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ message: 'Error sending email.' });
  }
}