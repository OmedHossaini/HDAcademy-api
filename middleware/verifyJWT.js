// Import the jsonwebtoken module
const jwt = require('jsonwebtoken')

// Define a middleware function to verify JWT tokens
const verifyJWT = (req, res, next) => {
    // Retrieve the Authorization header from the request, allowing for case-insensitivity
    const authHeader = req.headers.authorization || req.headers.Authorization

    // Check if the Authorization header starts with 'Bearer '
    if (!authHeader?.startsWith('Bearer ')) {
        // If not, respond with Unauthorized status
        return res.status(401).json({ message: 'Unauthorized' })
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1]

    // Verify the JWT token using the provided ACCESS_TOKEN_SECRET
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            // If an error occurs during verification, respond with Forbidden status
            if (err) return res.status(403).json({ message: 'Forbidden' })

            // Attach the decoded user information to the request object
            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles

            // Move to the next middleware in the stack
            next()
        }
    )
}

// Export the verifyJWT middleware for use in other files
module.exports = verifyJWT
