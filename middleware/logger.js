// Import necessary modules
const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

// Define an asynchronous function to log events
const logEvents = async (message, logFileName) => {
    // Get the current date and time in a formatted string
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')

    // Create a unique identifier using UUID
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        // Check if the 'logs' directory exists, create it if not
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        // Append the log item to the specified log file
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        // Log any errors that occur during the process
        console.log(err)
    }
}

// Define a middleware function to log request details
const logger = (req, res, next) => {
    // Log the request method, URL, and origin using the logEvents function
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')

    // Log the request method and path to the console
    console.log(`${req.method} ${req.path}`)

    // Move to the next middleware in the stack
    next()
}

// Export the logEvents and logger functions for use in other files
module.exports = { logEvents, logger }
