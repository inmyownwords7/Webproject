const winston = require('winston')
const winstonDailyRotatefile = require('winston-daily-rotate-file')
const morgan = require('morgan')
let eventName = ""
let listener = Object

// let format = winston.format({logform})

let winstonOptions = {
    level: 'info',
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
}

let transport = new winston.transports.DailyRotateFile(winstonOptions)

// winstonDailyRotatefile.on('', function (oldFileName, newFileName) {
//
// })

let logger = winston.createLogger({
    transports: [
        transport
    ]
});

// logger.info(message)

transport.on('pipe', function (oldFileName, newFileName) {

})

module.exports = logger;