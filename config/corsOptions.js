// Import the allowedOrigins array
const allowedOrigins = require('./allowedOrigins')

// Define CORS options for handling cross-origin requests
const corsOptions = {
    // Specify the allowed origins based on the allowedOrigins array
    origin: (origin, callback) => {
        // Check if the provided origin is in the allowedOrigins array or if it's not specified
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // Allow the request if the origin is in the allowedOrigins array or if it's not specified
            callback(null, true)
        } else {
            // Deny the request if the origin is not in the allowedOrigins array
            callback(new Error('Not allowed by CORS'))
        }
    },
    // Enable credentials in CORS requests
    credentials: true,
    // Set the status code for successful OPTIONS responses to 200
    optionsSuccessStatus: 200
}

// Export the CORS options for use in other files
module.exports = corsOptions
