const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 2,
        maxlength: 65,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email!'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        },
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        maxlength: 50,
        trim: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (inputPassword) {
    const isPasswordMatch = await bcrypt.compare(inputPassword, this.password)
    return isPasswordMatch
}

module.exports = mongoose.model('User', UserSchema)