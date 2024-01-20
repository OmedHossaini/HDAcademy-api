// Import the express module
const express = require('express')

// Create an instance of an Express router
const router = express.Router()

// Import the notes controller and JWT verification middleware
const notesController = require('../controllers/notesController')
const verifyJWT = require('../middleware/verifyJWT')

// Apply JWT verification middleware to all routes defined in this router
router.use(verifyJWT)

// Define routes for notes

// GET request to '/api/notes/' to retrieve all notes
// POST request to '/api/notes/' to create a new note
// PATCH request to '/api/notes/' to update a note
// DELETE request to '/api/notes/' to delete a note
router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

// Export the router for use in other files
module.exports = router
