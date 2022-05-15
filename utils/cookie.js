require("dotenv").config()

const createCookie = async (res, name, value) => {
    res.cookie(name, value, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
}

const deleteCookie = async (res, name) => {
    res.cookie(name, '', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
}

module.exports = {
    createCookie,
    deleteCookie
}