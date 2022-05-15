const notFoundMiddleware = (req, res) => res.status(404).json({ errorMessage: "Not found"})

module.exports = notFoundMiddleware