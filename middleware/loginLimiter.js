// Import necessary modules
const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

// Define a rate limiter for login attempts
const loginLimiter = rateLimit({
    // Set the time window for which the limit counts (in milliseconds)
    windowMs: 60 * 1000, // 1 minute

    // Set the maximum number of requests allowed within the time window
    max: 5,

    // Define the message to be sent when the limit is exceeded
    message: { message: 'Too many login attempts from this IP, please try again after a 60-second pause' },

    // Define the handler to be executed when the limit is exceeded
    handler: (req, res, next, options) => {
        // Log the exceeded rate limit details using the logEvents function
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')

        // Respond with the rate limit exceeded message and status code
        res.status(options.statusCode).send(options.message)
    },

    // Include standard headers in the response
    standardHeaders: true,

    // Exclude legacy headers from the response
    legacyHeaders: false,
})

// Export the loginLimiter middleware for use in other files
module.exports = loginLimiter
