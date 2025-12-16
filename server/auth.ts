import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage.js";
import type { User as AppUser } from "../shared/schema.js";

declare global {
  namespace Express {
    interface User extends Omit<AppUser, "passwordHash"> {}
  }
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email found in Google profile"));

        console.log(`Auth attempt for email: ${email}`);
        
        let user = await storage.getUserByEmail(email);

        if (!user) {
          console.log(`Creating new user for email: ${email}`);
          const role = email === "hashimadil001@gmail.com" ? "admin" : "user";
          console.log(`Assigning role: ${role} to ${email}`);
          
          // Create a new user
          const newUser = await storage.createUser({
            email,
            name: profile.displayName || email.split("@")[0],
            role,
          });
          user = newUser;
          console.log(`Created user:`, user);
        } else {
          console.log(`Existing user found:`, user);
          // Update role if needed
          if (email === "hashimadil001@gmail.com" && user.role !== "admin") {
            console.log(`Updating ${email} to admin role`);
            user = await storage.updateUserRole(user.id, "admin");
            console.log(`Updated user:`, user);
          }
        }

        return done(null, user);
      } catch (err) {
        console.error("Auth error:", err);
        return done(err);
      }
    }
  )
);

export { passport };
