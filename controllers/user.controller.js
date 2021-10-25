const User = require('../models/User');
const bcrypt = require('bcryptjs');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const secretKey = "MeanStack-2021"

exports.register = async(req, res) => {
    const userSchema = joi.object({
        fullName: joi.string().required().min(3),
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,16}$'))
    })
    try {
        let userFields = await userSchema.validateAsync(req.body);

        console.log(userFields.email);

        let user = await User.findOne({ email: userFields.email });

        if (!user) {
            user = new User(userFields);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            res.status(200).json({
                message: "User Registered Successfully",
                user: user
            })
        } else {
            res.status(400).json({
                message: "User already exists"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something went wrong",
            error: err

        })
    }
}

exports.login = async(req, res) => {
    const loginSchema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()

    })

    try {
        const loginFields = await loginSchema.validateAsync(req.body);
        // whether this user with the provided email exist or not
        let user = await User.findOne({ email: loginFields.email });

        if (!user) {
            res.status(400).json({
                message: "Username/Password doesn't exist"
            })
        } else {
            const is_match = await bcrypt.compare(loginFields.password, user.password);
            if (!is_match) {
                res.status(400).json({
                    message: "Username/Password doesn't exist"
                })
            } else {
                const payload = {
                    userdata: {
                        id: user._id
                    }
                }
                const token = await jwt.sign(payload, secretKey, { expiresIn: 7200 })
                res.status(200).json({
                    message: "Logged In",
                    user: { id: user._id, name: user.fullName },
                    token
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        })
    }
}