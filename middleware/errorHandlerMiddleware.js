const { StatusCodes } = require("http-status-codes")
const errorHandlerMiddleware = (err, req, res, next) => {
    // Error default
    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage: err.message || 'Something went wrong, try again later!'
    }
    // Validation error - multiple
    if(err.name === 'ValidationError') {
        customError.statusCode = 400        
        customError.errorMessage = Object.values(err.errors)
        .map( item => item.message )
        .join(',')
    }
    // Mongodb value duplication error
    if(err.code && err.code === 11000) {
        customError.statusCode = 400
        customError.errorMessage = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value.`
    }
    // Mongodb - 
    if(err.name === 'CastError') {
        customError.statusCode = 404
        customError.errorMessage = `No record found with id ${err.value}.`
    }

    return res.status(customError.statusCode).json({ errorMessage: customError.errorMessage })
}

module.exports = errorHandlerMiddleware