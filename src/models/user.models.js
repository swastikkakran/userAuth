import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        index: true,
        trim: true,
        min: 3,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        trim: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: String,
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date
}, {timestamps: true})


userSchema.pre("save", async (next) => {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id,
            username
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

//for email verifcation/password reset
userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex")
    const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex")
    const tokenExpiry = Date.now() + (20*60*1000)

    return {unHashedToken, hashedToken, tokenExpiry}
}

export const User =  model("User", userSchema)