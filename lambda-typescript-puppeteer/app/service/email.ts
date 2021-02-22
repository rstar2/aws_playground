import nodemailer, { SentMessageInfo } from 'nodemailer';

// server.js
const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '2a591f5397e74b',
        pass: 'c8115f6368ceb0',
    },
});

/**
 * Sends mail
 * @param options Contains emails recipient, subject and text
 */
export async function send(options: {
    fromName: string;
    fromEmail: string;
    userEmail: string;
    subject: string;
    message: string;
}): Promise<SentMessageInfo> {
    const info = await transporter.sendMail({
        from: `${options.fromName} <${options.fromEmail}>`,
        to: options.userEmail,
        subject: options.subject,
        text: options.message,
    });

    console.log(info.messageId);
    return info;
}
