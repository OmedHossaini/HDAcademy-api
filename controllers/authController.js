// Import necessary modules and packages
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// Define an asynchronous function for user login
const login = asyncHandler(async (req, res) => {
    // Extract username and password from the request body
    const { username, password } = req.body

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Find the user in the database based on the provided username
    const foundUser = await User.findOne({ username }).exec()

    // Check if user exists and is active
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    // Compare the provided password with the hashed password stored in the database
    const match = await bcrypt.compare(password, foundUser.password)

    // If passwords don't match, return unauthorized
    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    // Generate an access token with user information
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    // Generate a refresh token
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Set the refresh token as a cookie with specific options
    res.cookie('jwt', refreshToken, {
        httpOnly: true, 
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // Send the access token in the response
    res.json({ accessToken })
})

// Define a function to refresh the access token
const refresh = (req, res) => {
    // Extract cookies from the request
    const cookies = req.cookies

    // Check if the refresh token is present in cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    // Retrieve the refresh token from cookies
    const refreshToken = cookies.jwt

    // Verify the refresh token and generate a new access token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            // If verification fails, return forbidden
            if (err) return res.status(403).json({ message: 'Forbidden' })

            // Find the user based on the decoded username
            const foundUser = await User.findOne({ username: decoded.username }).exec()

            // If user not found, return unauthorized
            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            // Generate a new access token
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            // Send the new access token in the response
            res.json({ accessToken })
        })
    )
}

// Define a function to handle user logout
const logout = (req, res) => {
    // Extract cookies from the request
    const cookies = req.cookies
    
    // If the refresh token is not present, send a success status
    if (!cookies?.jwt) return res.sendStatus(204)

    // Clear the refresh token cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })

    // Send a response indicating the cookie is cleared
    res.json({ message: 'Cookie cleared' })
}

// Export login, refresh, and logout functions
module.exports = {
    login,
    refresh,
    logout
}
