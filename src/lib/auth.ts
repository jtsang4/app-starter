import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, phoneNumber } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  baseURL: env.VITE_APP_URL || env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: env.BETTER_AUTH_SECRET,
  advanced: {
    database: {
      generateId: false, // 让数据库自动生成标准UUID格式的ID
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    sendResetPassword: async ({ user, url, token }, request) => {
      if (env.NODE_ENV === "development") {
        // Development mode: output reset password info to terminal
        console.log("=".repeat(50));
        console.log("🔑 Password Reset Email Mock - Development Only");
        console.log("=".repeat(50));
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name || "N/A"}`);
        console.log(`Reset Password URL: ${url}`);
        console.log(`Reset Token: ${token}`);
        console.log("=".repeat(50));
        console.log(
          "⚠️  In production, replace this with actual email provider",
        );
        console.log("=".repeat(50));
        return;
      }

      // Production mode: send actual email
      // TODO: Implement email sending with provider like SendGrid, Nodemailer, etc.
      // Example with Nodemailer:
      // await transporter.sendMail({
      //   from: env.SMTP_FROM,
      //   to: user.email,
      //   subject: "Reset your password",
      //   html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      // });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      if (env.NODE_ENV === "development") {
        // Development mode: output verification code to terminal
        console.log("=".repeat(50));
        console.log("📧 Email Verification Mock - Development Only");
        console.log("=".repeat(50));
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name || "N/A"}`);
        console.log(`Verification URL: ${url}`);
        console.log(`Verification Token: ${token}`);
        console.log("=".repeat(50));
        console.log(
          "⚠️  In production, replace this with actual email provider",
        );
        console.log("=".repeat(50));
        return;
      }

      // Production mode: send actual email
      // TODO: Implement email sending with provider like SendGrid, Nodemailer, etc.
      // Example with Nodemailer:
      // await transporter.sendMail({
      //   from: env.SMTP_FROM,
      //   to: user.email,
      //   subject: "Verify your email",
      //   html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
      // });
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID &&
      env.GOOGLE_CLIENT_SECRET && {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 3, // 3 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 1 hour
    },
  },
  plugins: [
    admin(),
    // Phone number authentication plugin with environment-aware SMS implementation
    phoneNumber({
      sendOTP: async (phone, otp) => {
        if (env.NODE_ENV === "development") {
          // Development mode: output OTP to terminal with enhanced formatting
          console.log("=".repeat(50));
          console.log("📱 SMS OTP Mock - Development Only");
          console.log("=".repeat(50));
          console.log(`Phone Number: ${phone}`);
          console.log(`OTP Code: ${otp}`);
          console.log("=".repeat(50));
          console.log(
            "⚠️  In production, replace this with actual SMS provider",
          );
          console.log("=".repeat(50));
          return Promise.resolve();
        }

        // Production mode: send actual SMS
        // TODO: Replace with actual SMS provider in production
        // Example with Twilio:
        // await twilioClient.messages.create({
        //   body: `Your verification code is: ${otp}`,
        //   to: phone,
        //   from: env.TWILIO_PHONE_NUMBER,
        // });

        // For now, just log to console
        console.log("=".repeat(50));
        console.log("📱 SMS OTP - Production Mode (Not Implemented)");
        console.log("=".repeat(50));
        console.log(`Phone Number: ${phone}`);
        console.log(`OTP Code: ${otp}`);
        console.log("=".repeat(50));
        console.log("⚠️  Please implement actual SMS provider");
        console.log("=".repeat(50));
        return Promise.resolve();
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
