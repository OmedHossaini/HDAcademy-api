// Import the express module
const express = require('express')

// Create an instance of an Express router
const router = express.Router()

// Import the path module
const path = require('path')

// Define a route for serving the index.html file for variations of the root and '/index.html' path
router.get('^/$|/index(.html)?', (req, res) => {
    // Send the index.html file using the path module
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

// Export the router for use in other files
module.exports = router
