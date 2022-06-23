const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: "Name is required"
    },
    email: {
        type: String,
        trim: true,
        unique: "Email already exists",
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
        required: "Email is required"
    },
    password: {
        type: String,
        required: "Password is required"
    },
    about: {
        type: String,
        trim: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    salt: String,
    followings: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});


userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.password;
    },
    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(password)
                .digest("hex")
        } catch (error) {
            return "";
        }
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + "";
    }
}

userSchema.path("password").validate(function (v) {
    this.password = (this.password).trim();
    if (this.password && this.password.length < 8) {
        this.invalidate("password", "Password must be at least 8 characters.");
    }
    if (this.isNew && !this.password) {
        this.invalidate("password", "Password is required.");
    }
}, null);

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.salt = userSchema.methods.makeSalt();
        this.password = this.encryptPassword(this.password);
    }
    next();
})


const User = mongoose.model("User", userSchema);

module.exports = User;