const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const User = require("../models/User")
const { createJWT, createCookie } = require("../utils")

const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password')
    if (!users) {
        res.status(StatusCodes.BAD_REQUEST).json({ status: false, errorMessage: 'No record found!' })
    }
    res.status(StatusCodes.OK).json({ status: true, message: 'Data fetched', users })
}

const getSingleUser = async (req, res) => {
    const users = await User.find({ role: 'user', _id: req.params.id }).select('-password')
    if (!users) {
        res.status(StatusCodes.BAD_REQUEST).json({ status: false, errorMessage: 'No record found!' })
    }
    res.status(StatusCodes.OK).json({ status: true, message: 'Data fetched', users })
}

const updateUser = async (req, res) => {
    const id = req.params.id
    const { fullname, email } = req.body
    let userDetails = {}

    if (!fullname || !email) {
        throw new CustomError.UnauthorizedError("Please provide fullname and email!")
    }

    const user = await User.findOne({ _id: id }).select('-password')

    if (user.role === "admin") {
        throw new CustomError.UnauthorizedError('Not authorized to update this user!')
    }

    if (!user) {
        throw new CustomError.NotFoundError(`No record found with id: ${id}`)
    }

    if (email === user.email) {
        userDetails.fullname = fullname
    } else {
        userDetails.fullname = fullname
        userDetails.email = email
    }

    const updatedUser = await User.updateOne({ _id: id }, userDetails, {
        new: true,
        runValidators: true,
    });

    if (req.user.id == id) {
        const token = createJWT(user)
        if (token) {
            createCookie(res, 'token', token)
        }
    }

    res.status(StatusCodes.OK).json({ status: true, message: 'Record updated successfully', updatedUser })
}

const updatedMyAccount = async (req, res) => {
    const id = req.user.id
    const { fullname, email } = req.body
    let userDetails = {}

    if (!fullname || !email) {
        throw new CustomError.BadRequestError("Please provide fullname and email!")
    }

    const user = await User.findOne({ _id: id }).select('-password')


    if (!user) {
        throw new CustomError.NotFoundError(`No record found with id: ${id}`)
    }

    if (email === user.email) {
        userDetails.fullname = fullname
    } else {
        userDetails.fullname = fullname
        userDetails.email = email
    }

    const updatedUser = await User.updateOne({ _id: id }, userDetails, {
        new: true,
        runValidators: true,
    });


    const token = createJWT(user)
    if (token) {
        createCookie(res, 'token', token)
    }

    res.status(StatusCodes.OK).json({ status: true, message: 'Record updated successfully', updatedUser })
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const id = req.user.id

    if (!oldPassword || !newPassword) {
        throw new CustomError.UnauthorizedError('Please provide old password and new password')
    }
    const user = await User.findOne({ _id: id })
    if (!user) {
        throw new CustomError.NotFoundError(`No record found with id: ${id}`)
    }

    const isPasswordMatch = await user.comparePassword(oldPassword)

    if (!isPasswordMatch) {
        throw new CustomError.UnauthorizedError('Old password does not match!')
    }

    user.password = newPassword

    const result = await user.save()
    res.status(StatusCodes.OK).json({ status: true, message: 'User password has been updated successfully', result })
}

const myAccount = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    updatedMyAccount,
    myAccount,
    changePassword
}