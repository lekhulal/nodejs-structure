const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
const { createJWT, createCookie, deleteCookie } = require("../utils")

const register = async (req, res) => {
    const { fullname, email, password } = req.body

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new CustomError.BadRequestError('The email address provided is already registered!')
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ fullname, email, password, role })
    res.status(StatusCodes.CREATED).json({ status: true, message: 'Registered successfully!', user })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError.UnauthorizedError('Please provide email and password!')
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.BadRequestError('The email address provided is not registered!')
    }

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        throw new CustomError.UnauthorizedError('Invalid username/password!')
    }

    const token = createJWT(user)
    if (token) {
        createCookie(res, 'token', token)
    }

    res.json({ token, status: true, message: 'User authenticated successfully!' })
}

const logout = async (req, res) => {
    deleteCookie(res, 'token')
    res.json({ status: true, message: 'User logout!' })
}

module.exports = {
    register,
    login,
    logout
}