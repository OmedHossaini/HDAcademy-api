// Import the express module
const express = require('express')

// Create an instance of an Express router
const router = express.Router()

// Import the authentication controller and login limiter middleware
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

// Define routes for authentication

// POST request to '/api/auth/' for user login, applying login limiter middleware
router.route('/')
    .post(loginLimiter, authController.login)

// GET request to '/api/auth/refresh' for token refresh
router.route('/refresh')
    .get(authController.refresh)

// POST request to '/api/auth/logout' for user logout
router.route('/logout')
    .post(authController.logout)

// Export the router for use in other files
module.exports = router
