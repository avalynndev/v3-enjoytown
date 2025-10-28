import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, multiSession, magicLink } from "better-auth/plugins";
import { db } from "@/db/drizzle";
import { schema } from "@/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { EmailTemplate } from "@daveyplate/better-auth-ui/server";

const resend = new Resend(process.env.RESEND_API_KEY || "");
const fromEmail = "ENJOYTOWN <noreply@auth.newtech.dev>";

export const auth = betterAuth({
  appName: "Enjoytown",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }) => {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: "Reset your password",
        react: EmailTemplate({
          heading: "Reset Password",
          content: "Click the button below to reset your password.",
          action: "Reset Password",
          url,
        }),
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request
      ) => {
        await resend.emails.send({
          from: fromEmail,
          to: user.email,
          subject: "Verify your email change",
          react: EmailTemplate({
            heading: "Verify Email Change",
            content: "Click the button below to verify your email change.",
            action: "Verify Email Change",
            url,
          }),
        });
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubdomainCookies: {
      enabled: false,
    },
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  plugins: [
    nextCookies(),
    username(),
    multiSession(),
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: "Magic Link",
          react: EmailTemplate({
            heading: "Magic Link",
            content: "Click the button below to securely log in.",
            action: "Log In",
            url: url,
          }),
        });
      },
    }),
  ],
  callbacks: {
    before: {
      signUp: async (ctx: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        // Custom password validation
        if (ctx.body.password) {
          const password = ctx.body.password as string;
          
          if (password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
          }
          
          if (password.length > 128) {
            throw new Error("Password must be less than 128 characters");
          }
          
          // Check for at least one uppercase letter
          if (!/[A-Z]/.test(password)) {
            throw new Error("Password must contain at least one uppercase letter");
          }
          
          // Check for at least one lowercase letter
          if (!/[a-z]/.test(password)) {
            throw new Error("Password must contain at least one lowercase letter");
          }
          
          // Check for at least one number
          if (!/\d/.test(password)) {
            throw new Error("Password must contain at least one number");
          }
        }
        
        return ctx;
      },
    },
  },
});
export const { getSession } = auth.api;

export type SessionData = (typeof auth)["$Infer"]["Session"];
