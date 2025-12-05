import passportJwt from "passport-jwt";
import passport from "passport";
import { JWT_SECRET } from "../constant";
import passportGoogle from "passport-google-oauth20";
import User from "../models/User";
import { Op } from "sequelize";

var JwtStrategy = passportJwt.Strategy,
  ExtractJwt = passportJwt.ExtractJwt;

var GoogleStrategy = passportGoogle.Strategy;

var opts: passportJwt.WithSecretOrKey = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

// For authentication with JWT
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    if (jwt_payload) {
      return done(null, {
        id: jwt_payload.id,
        username: jwt_payload.username,
        role: jwt_payload.role,
      });
    }

    return done(true, false);
  })
);

// For authentication with GoogleAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${process.env.CALLBACK_URL}/api/v1/auth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({
          where: {
            [Op.or]: {
              googleId: profile.id,
              email: profile.emails && profile.emails[0].value,
            },
          },
        });

        // If user doesn't exist, create a new one
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails && profile.emails[0].value,
            googleId: profile.id,
          });
        }

        // Return the user (existing or newly created)
        return done(null, user);
      } catch (error) {
        console.log("Google authentication error:", error);
        return done(error);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "username", "googleId"],
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export const authenticateJwt = passport.authenticate("jwt", { session: false });
