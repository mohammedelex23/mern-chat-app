const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { expressjwt: expressJwt } = require("express-jwt");


function validate(email, password) {
    email = email && email.trim();
    password = password && password.trim();
    let errors = {
        errors: []
    }
    // check for empty
    if (!password) {
        errors.type = "validationError";
        errors.errors.push({
            name: "password",
            message: "password is required"
        })
    }
    if (!email) {
        errors.type = "validationError";
        errors.errors.push({
            name: "email",
            message: "email is required"
        })
    }
    // check invalid email
    let regex = new RegExp(".+\@.+\..+");
    if (email && !regex.test(email)) {
        errors.type = "validationError";
        errors.errors.push({
            name: "email",
            message: "please provide a valid email"
        })
    }
    return {
        error: errors.errors.length > 0,
        errors
    }

}

const signin = async function (req, res, next) {
    try {
        let { error, errors } = validate(req.body.email, req.body.password);
        if (error) {
            return res.status(400).json({
                error,
                errors
            })
        }

        let user = await User.findOne({ email: req.body.email });
        if (!user || !user.authenticate(req.body.password)) {
            return res.status(401).json({
                error: true,
                errors: {
                    type: "authError",
                    errors: [
                        {
                            name: "auth",
                            message: "Email or password is wrong"
                        }
                    ]
                }
            })
        }

        // token and cookie expires after one day
        let token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: "26h" });
        res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 });

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                followings: user.followings
            }
        })
    } catch (error) {
        res.status(401).json({
            error: true,
            errors: {
                type: "NotImplemented",
                errors: [
                    {
                        name: "auth",
                        message: error.message || "something went wrong "
                    }
                ]
            }
        });
    }
}
const signout = async function (req, res, next) {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Successfully signed out"
    });
}

const authenticate = expressJwt({ secret: config.jwtSecret, algorithms: ["HS256"] });

const verify = function (req, res, next) {
    try {
        let authorized = req.profile && req.auth

        if (!authorized) {
            return res.status(403).json({
                error: true,
                message: "User is not authorized"
            });
        }
        next();
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
const authoriz = function (req, res, next) {
    try {
        let authorized = req.profile && req.auth
            && req.profile._id == req.auth._id;
        if (!authorized) {
            return res.status(403).json({
                error: true,
                message: "User is not authorized"
            });
        }
        next();
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

const requireSignin = async function (req, res, next) {
    try {

        let user = await User.findById(req.body.userId);
        let authorized = user._id && req.auth

        if (!authorized) {
            return res.status(403).json({
                error: true,
                message: "User is not authorized"
            });
        }

        next();
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}

module.exports = { signin, signout, authoriz, authenticate, verify, requireSignin };