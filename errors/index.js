const CustomError = require("./customError")
const BadRequestError = require("./badRequestError")
const ForbiddenError = require("./forbiddenError")
const UnauthorizedError = require("./unauthorizedError")
const NotFoundError = require("./notFoundError")

module.exports = {
    CustomError,
    BadRequestError,
    ForbiddenError,
    UnauthorizedError,
    NotFoundError
}