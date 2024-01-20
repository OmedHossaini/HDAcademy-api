// Import necessary modules and models
const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// Define an asynchronous function to get all users (excluding password)
const getAllUsers = asyncHandler(async (req, res) => {
    // Retrieve all users from the database excluding password field
    const users = await User.find().select('-password').lean()

    // Check if any users are found
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    // Respond with the list of users
    res.json(users)
})

// Define an asynchronous function to create a new user
const createNewUser = asyncHandler(async (req, res) => {
    // Extract data from the request body
    const { username, password, roles } = req.body

    // Check if all required fields are provided
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()

    // If a duplicate is found, return conflict status
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash the password before storing it
    const hashedPwd = await bcrypt.hash(password, 10)

    // Create a new user object
    const userObject = { username, "password": hashedPwd, roles }

    // Create a new user in the database
    const user = await User.create(userObject)

    // Check if the user is successfully created and respond accordingly
    if (user) { 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// Define an asynchronous function to update an existing user
const updateUser = asyncHandler(async (req, res) => {
    // Extract data from the request body
    const { id, username, roles, active, password } = req.body

    // Check if all required fields (except password) are provided
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Find the existing user in the database
    const user = await User.findById(id).exec()

    // If the user is not found, return a not found status
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()

    // If a duplicate is found and it's not the same user being updated, return conflict status
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Update user fields with the new data
    user.username = username
    user.roles = roles
    user.active = active

    // If a new password is provided, hash and update the password
    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    // Save the updated user to the database
    const updatedUser = await user.save()

    // Respond with a success message
    res.json({ message: `${updatedUser.username} updated` })
})

// Define an asynchronous function to delete a user
const deleteUser = asyncHandler(async (req, res) => {
    // Extract the user ID from the request body
    const { id } = req.body

    // Check if the user ID is provided
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Check if the user has assigned notes
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // Find the user in the database
    const user = await User.findById(id).exec()

    // If the user is not found, return a not found status
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Delete the user from the database
    const result = await user.deleteOne()

    // Respond with a success message including the deleted user's information
    const reply = `Username ${result.username} with ID ${result._id} deleted`
    res.json(reply)
})

// Export functions to be used in other files
module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}
