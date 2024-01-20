// Import the express module
const express = require('express')

// Create an instance of an Express router
const router = express.Router()

// Import the users controller and JWT verification middleware
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

// Apply JWT verification middleware to all routes defined in this router
router.use(verifyJWT)

// Define routes for users

// GET request to '/api/users/' to retrieve all users
// POST request to '/api/users/' to create a new user
// PATCH request to '/api/users/' to update a user
// DELETE request to '/api/users/' to delete a user
router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

// Export the router for use in other files
module.exports = router
