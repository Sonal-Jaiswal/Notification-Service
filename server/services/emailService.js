const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.send = ({ content }) => {
    return transporter.sendMail({
        from: `"Notifier" <${process.env.EMAIL_USER}>`,
        to: "", // In production, resolve user email
        subject: "New Notification",
        text: content
    });
};