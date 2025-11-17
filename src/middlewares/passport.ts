import passportJwt from "passport-jwt";
import passport from "passport";
import { JWT_SECRET } from "../constant";

var JwtStrategy = passportJwt.Strategy,
  ExtractJwt = passportJwt.ExtractJwt;
var opts: passportJwt.WithSecretOrKey = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    if (jwt_payload) {
      return done(null, { id: jwt_payload.id, username: jwt_payload.username });
    }

    return done(true, false);
  })
);

export default passport.authenticate("jwt", { session: false });
