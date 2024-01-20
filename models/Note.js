// Import necessary modules
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

// Define the schema for the 'Note' model
const noteSchema = new mongoose.Schema(
    {
        // Reference to the 'User' model for user association
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        // Title of the note, required field
        title: {
            type: String,
            required: true
        },
        // Text content of the note, required field
        text: {
            type: String,
            required: true
        },
        // Completion status of the note, defaults to false
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        // Enable timestamps to automatically add 'createdAt' and 'updatedAt' fields
        timestamps: true
    }
)

// Plugin for Auto Increment functionality, starting from ticket number 500
noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',    // Field to store the incremented value
    id: 'ticketNums',       // Identifier for the Auto Increment plugin
    start_seq: 500           // Initial sequence number
})

// Export the 'Note' model using the defined schema
module.exports = mongoose.model('Note', noteSchema)
