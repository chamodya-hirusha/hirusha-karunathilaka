import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import AdminOTP from "@/lib/models/AdminOTP";
import { verifyPassword } from "@/lib/auth-helper";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // 1. Parse request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Find administrator account matching the email/username
    const admin = await Admin.findOne({ username: email.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Verify password
    const isPasswordValid = verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Generate 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // 5. Save/Update OTP record in database
    await AdminOTP.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        otp_code: otpCode,
        expires_at: expiresAt,
        is_verified: false,
      },
      { upsert: true, new: true }
    );

    const smtpUser = process.env.SMTP_USER || "chamodyahirusha21@gmail.com";
    const smtpPass = process.env.SMTP_PASSWORD || "ioguywxeysptpobw";

    // 6. Configure Nodemailer with Gmail SMTP and the user's Gmail App Password
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 7. Compose a luxury minimalist dark-themed HTML email
    const mailOptions = {
      from: `"Chamodya Portfolio Admin" <${smtpUser}>`,
      to: email.toLowerCase().trim(),
      subject: "Chamodya Portfolio - Admin Login OTP Code",
      html: `
        <div style="background-color: #07080c; color: #f4f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; border-radius: 12px; border: 1px solid rgba(34, 211, 238, 0.15); max-width: 480px; margin: 20px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 30px;">
            <span style="font-size: 10px; font-weight: 700; letter-spacing: 3px; color: #22d3ee; text-transform: uppercase;">Security Gateway</span>
            <h2 style="color: #ffffff; margin-top: 5px; font-weight: 800; font-size: 20px; letter-spacing: -0.5px;">Verification Required</h2>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 25px;">
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; font-weight: 350; margin-bottom: 25px;">
              An administrator login attempt was initiated for your developer portfolio. Please use the following One-Time Password (OTP) to complete your identity verification. This code is active for <strong>5 minutes</strong>.
            </p>
            <div style="background-color: rgba(17, 19, 24, 0.6); border: 1px solid rgba(255,255,255,0.08); padding: 24px; text-align: center; border-radius: 10px; margin: 25px 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">
              <span style="font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #22d3ee; font-family: 'Courier New', Courier, monospace; display: block; margin-left: 10px;">${otpCode}</span>
            </div>
            <p style="font-size: 10px; color: #64748b; font-weight: 350; line-height: 1.5; margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; text-align: center;">
              If you did not initiate this request, please change your database admin credentials immediately. This is an automated security transmission.
            </p>
          </div>
        </div>
      `,
    };

    // 8. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "One-Time Password has been sent to your verified admin email address",
    });
  } catch (error: unknown) {
    console.error("SEND OTP ERROR DETAILS:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
    return NextResponse.json(
      { error: "Failed to process OTP transmission", details: errorMessage },
      { status: 500 }
    );
  }
}
