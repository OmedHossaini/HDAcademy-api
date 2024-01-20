// Import necessary modules and models
const Note = require('../models/Note')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// Define an asynchronous function to get all notes with associated user information
const getAllNotes = asyncHandler(async (req, res) => {
    // Retrieve all notes from the database
    const notes = await Note.find().lean()

    // Check if any notes are found
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    // Enhance each note with the associated user information
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    // Respond with the enhanced notes
    res.json(notesWithUser)
})

// Define an asynchronous function to create a new note
const createNewNote = asyncHandler(async (req, res) => {
    // Extract data from the request body
    const { user, title, text } = req.body

    // Check if all required fields are provided
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate note title
    const duplicate = await Note.findOne({ title }).lean().exec()

    // If a duplicate is found, return conflict status
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    // Create a new note in the database
    const note = await Note.create({ user, title, text })

    // Check if the note is successfully created and respond accordingly
    if (note) { 
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }
})

// Define an asynchronous function to update an existing note
const updateNote = asyncHandler(async (req, res) => {
    // Extract data from the request body
    const { id, user, title, text, completed } = req.body

    // Check if all required fields are provided
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Find the existing note in the database
    const note = await Note.findById(id).exec()

    // If the note is not found, return a not found status
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // Check for a duplicate note title
    const duplicate = await Note.findOne({ title }).lean().exec()

    // If a duplicate is found and it's not the same note being updated, return conflict status
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    // Update the note with the new data
    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    // Save the updated note to the database
    const updatedNote = await note.save()

    // Respond with a success message
    res.json(`'${updatedNote.title}' updated`)
})

// Define an asynchronous function to delete a note
const deleteNote = asyncHandler(async (req, res) => {
    // Extract the note ID from the request body
    const { id } = req.body

    // Check if the note ID is provided
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    // Find the note in the database
    const note = await Note.findById(id).exec()

    // If the note is not found, return a not found status
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // Delete the note from the database
    const result = await note.deleteOne()

    // Respond with a success message including the deleted note's information
    const reply = `Note '${result.title}' with ID ${result._id} deleted`
    res.json(reply)
})

// Export functions to be used in other files
module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}
