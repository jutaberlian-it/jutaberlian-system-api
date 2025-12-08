import passportJwt from "passport-jwt";
import passport from "passport";
import { JWT_SECRET } from "../constant";
import passportGoogle from "passport-google-oauth20";
import passportLocal from "passport-local";
import User from "../models/User";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

var JwtStrategy = passportJwt.Strategy,
  ExtractJwt = passportJwt.ExtractJwt;

var GoogleStrategy = passportGoogle.Strategy;

var LocalStrategy = passportLocal.Strategy;

var opts: passportJwt.WithSecretOrKey = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const user = await User.findOne({
        where: { username },
      });

      if (!user)
        return cb(null, false, {
          message: "Incorrect username or password.",
        });

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid)
        return cb(null, false, {
          message: "Incorrect username or password.",
        });

      return cb(null, {
        username: user.username,
        id: user.id,
        role_id: user.role_id,
      });
    } catch (error) {
      return cb(error);
    }
  })
);

// For authentication with JWT
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    if (jwt_payload) {
      return done(null, {
        id: jwt_payload.id,
        username: jwt_payload.username,
        role_id: jwt_payload.role_id,
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

export default passport;
