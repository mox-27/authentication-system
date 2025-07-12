import nodemailer from 'nodemailer';

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    from: process.env.MAIL_FROM
});


export async function send_mail(to, subject, text, html = null) {
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
        to: to,
        subject: subject,
        text: text, // plain‑text body
        html: html ? html : undefined, // HTML body
    });
};