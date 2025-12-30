import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        defaultValue: "01734566734",
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true, // when create account then send only email varification
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // here add third party emil sender
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      const info = await transporter.sendMail({
        from: '"Datta It Sulation" <suvodatta72@gmail.com>',
        to: `${user.email}`,
        subject: "Job curculer for backend developer",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width" />
            <title>Verify Email</title>
          </head>
          <body style="margin:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:30px 10px;">
                  <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;">
                    <tr>
                      <td style="padding:24px 28px;text-align:center;">
                        <h2 style="margin:0 0 10px;font-size:22px;color:#111;">
                         Hello ${user.name} Verify your email
                        </h2>

                        <p style="margin:0 0 20px;color:#555;font-size:14px;">
                          Click the button below to confirm your email address:
                        </p>

                        <a href="${verificationUrl}"
                          style="display:inline-block;background:#4f46e5;color:#fff;
                                  padding:12px 22px;border-radius:6px;
                                  text-decoration:none;font-size:14px;font-weight:bold;">
                          Verify Email
                        </a>

                        <p style="margin:20px 0 10px;color:#777;font-size:12px;">
                          Or copy and paste this link in your browser:
                        </p>

                        <p style="word-break:break-all;color:#4f46e5;font-size:12px;">
                          ${verificationUrl}
                        </p>

                        <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />

                        <p style="margin:0;color:#999;font-size:12px;">
                          If you didn’t create this account, you can ignore this email.
                        </p>

                        <p style="margin:10px 0 0;color:#999;font-size:12px;">
                          — Datta IT Solution
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      console.log("--- send verifaction email ---", info.messageId);
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
