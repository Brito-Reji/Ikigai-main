import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
    // Production Gmail configuration
    if (!process.env.EMAIL || !process.env.NODE_MAILER_PASSWORD) {
        throw new Error("Missing email credentials in .env (EMAIL and NODE_MAILER_PASSWORD)");
    }

    return nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.NODE_MAILER_PASSWORD,
        },
    });
};


// Professional email template
const getOtpTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="400" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0 30px 0; background-color: #135663;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">IKIGAI</h1>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-size: 20px; font-weight: bold;">
                                        Verify Your Email
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #555; font-size: 16px; line-height: 24px;">
                                        Thank you for choosing Ikigai. Use the following OTP to complete your verification process. This code is valid for 10 minutes.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="background-color: #f9f9f9; padding: 25px; border-radius: 6px; border: 1px dashed #135663;">
                                        <span style="font-size: 36px; font-weight: 800; color: #135663; letter-spacing: 5px;">${otp}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 0 0 0; color: #888; font-size: 14px; text-align: center;">
                                        If you didn't request this, please ignore this email.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 30px; background-color: #f4f7f6; color: #888; font-size: 12px; text-align: center;">
                            <p style="margin: 0;">&copy; 2024 Ikigai Learning Platform. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Send OTP email
export const sendOtpEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        const sender = process.env.EMAIL;

        const mailOptions = {
            from: `"Ikigai Support" <${sender}>`,
            to: email,
            subject: "Verify Your Ikigai Account",
            html: getOtpTemplate(otp),
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: "Email sent successfully",
            data: { email }
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to send email",
            data: error.message
        };
    }
};

