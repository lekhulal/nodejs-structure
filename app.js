require("dotenv").config()
require("express-async-errors")

// express
const express = require("express")
const app = express()
app.use(express.json())

// HTTP request logger
const morgan = require('morgan');

// database
const connectDB = require("./db/connect")

// cookie
const cookieParser = require("cookie-parser")

// security
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// middleware
const notFoundMiddleware = require("./middleware/notFoundMiddleware")
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware")

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60,
    })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))

// route
const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")
app.get('/', (req, res) => {
    res.send('<h3>Project root route!')
})
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`Server is running on ${port}`));
    } catch (err) {
        console.log(`App boot error ${err}`)
    }
}

start()
