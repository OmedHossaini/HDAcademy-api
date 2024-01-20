// Import the mongoose module
const mongoose = require('mongoose')

// Define the schema for the 'User' model
const userSchema = new mongoose.Schema({
    // User's username, a required field
    username: {
        type: String,
        required: true
    },
    // User's password, a required field
    password: {
        type: String,
        required: true
    },
    // User's roles, defaulting to "Employee" if not specified
    roles: [{
        type: String,
        default: "Employee"
    }],
    // User's active status, defaulting to true
    active: {
        type: Boolean,
        default: true
    }
})

// Export the 'User' model using the defined schema
module.exports = mongoose.model('User', userSchema)
