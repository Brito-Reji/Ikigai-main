import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount();

// Send OTP email
export const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const mailOptions = {
        from: '"Ikigai" <noreply@ikigai.com>',
        to: email,
        subject: "Your OTP Code",
        html: `<h2>Your OTP is: ${otp}</h2><p>Expires in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent to", email);
};
