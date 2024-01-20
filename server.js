// Load environment variables from the .env file
require('dotenv').config()

// Import necessary modules
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

// Log the current environment mode to the console
console.log(process.env.NODE_ENV)

// Connect to MongoDB using the connectDB function
connectDB()

// Apply the logger middleware to log incoming requests
app.use(logger)

// Enable Cross-Origin Resource Sharing (CORS) using configured options
app.use(cors(corsOptions))

// Parse incoming JSON requests
app.use(express.json())

// Parse cookies from incoming requests
app.use(cookieParser())

// Serve static files from the 'public' directory for the root path
app.use('/', express.static(path.join(__dirname, 'public')))

// Define routes for different parts of the application
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))

// Handle requests to unknown routes with a 404 response
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// Apply the errorHandler middleware to handle errors
app.use(errorHandler)

// Listen for the 'open' event on the MongoDB connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    // Start the server listening on the specified port
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

// Listen for the 'error' event on the MongoDB connection
mongoose.connection.on('error', err => {
    console.log(err)
    // Log MongoDB connection errors using the logEvents function
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
