const CustError = require("../errors")
const { isValidToken } = require("../utils")

const isAuth = async (req, res, next) => {
    const token = req.signedCookies.token

    if (!token) {
        throw new CustError.UnauthorizedError('Authentication Invalid')
    }

    const { id, email, role, fullname } = isValidToken({ token })
    req.user = { id, email, role, fullname }
    next()
}

const hasRouteAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustError.ForbiddenError('Unauthorized to access this route!')
        }
        next()
    }
}

module.exports = {
    isAuth,
    hasRouteAccess
}