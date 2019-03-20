const {createLogger, format, transports} = require('winston');

module.exports = createLogger({
format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(info => `[${info.level}] ${info.message} [${info.timestamp}]`)
),
transports:[
    new transports.Console({
        level: 'debug'
    })
  ]
});