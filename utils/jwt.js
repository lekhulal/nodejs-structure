const jwt = require("jsonwebtoken")

const createToken = (user) => {
    return { id: user.id, email: user.email, role: user.role, fullname: user.fullname }
}

const createJWT = (user) => {
    const payload = createToken(user)
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

const isValidToken = ({ token }) => jwt.verify(token, process.env.JWT_SECRET)

module.exports = {
    createToken,
    createJWT,
    isValidToken
}