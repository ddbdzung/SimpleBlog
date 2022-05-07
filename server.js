require('dotenv').config()
const express = require('express')
const connectFlash = require('connect-flash')
const httpStatus = require('http-status')
const bodyParser = require('body-parser')
const passport = require('passport')
const methodOverride = require('method-override')
const morgan = require('morgan')

const configViewEngine = require('./src/configs/viewEngine')
const ConnectDB = require('./src/configs/connectDB')
const configSession = require('./src/configs/session')
const routes = require('./src/routes')
const { errorConverter, errorHandler } = require('./src/middlewares/error')
const ApiError = require('./src/utils/ApiError')
const config = require('./src/configs/config')

// Init app
const app = express()

// Connect to MongoDB
ConnectDB()

// Config session
configSession(app)

// Config view engine
configViewEngine(app)

// Use morgan for debugging
app.use(morgan('combined'))

// parse json request body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({extended: true}))

// Enable flash messages
app.use(connectFlash())

// Config passport js
app.use(passport.initialize())
app.use(passport.session())

// Support override HTTP methods
app.use(methodOverride('_method'));

// Init routes
app.use('/', routes)

// send back a 404 error for any unknown api request
if (config.env !== 'development') {
  app.use((req, res, next) => {
    console.log(`url throws error is ${req.originalUrl}`)
    next(new ApiError(httpStatus.NOT_FOUND, 'Page not found!'));
  });
}

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

app.listen(config.port, config.host, () => {
  console.log(`Hello David Dang, I'm running at http://${config.host}:${config.port}/`)
})
