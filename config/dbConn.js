// Import the mongoose module
const mongoose = require('mongoose')

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Use Mongoose to connect to the database using the provided URI in the environment variables
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        // Log any errors that occur during the connection attempt
        console.log(err)
    }
}

// Export the connectDB function for use in other files
module.exports = connectDB
