const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const Admin = require('./models/admin');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

passport.use('user-local', new LocalStrategy(User.authenticate()));
passport.use('admin-local', new LocalStrategy(Admin.authenticate()));

exports.getToken = (user) => {
    return jwt.sign(user, process.env.secretKey, { expiresIn: '3h' });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretKey;

passport.use('jwt-user', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        console.log("JWT payload: ", jwt_payload);
        const user = await User.findOne({ _id: jwt_payload._id });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

passport.use('jwt-admin', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        console.log("JWT payload: ", jwt_payload);
        const admin = await Admin.findOne({ _id: jwt_payload._id });
        if (admin) {
            return done(null, admin);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

exports.verifyUser = passport.authenticate('jwt-user', { session: false });
exports.verifyAdmin = passport.authenticate('jwt-admin', { session: false });
