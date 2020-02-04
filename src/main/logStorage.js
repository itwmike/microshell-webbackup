const log4js = require('log4js')

log4js.addLayout('json', function (config) {
  return function (logEvent) { return JSON.stringify(logEvent) + config.separator }
})

log4js.configure({
  appenders: {
    out: {
      type: 'dateFile',
      pattern: 'yyyy-MM-dd',
      filename: './logs/log.json',
      keepFileExt: true,
      alwaysIncludePattern: true,
      layout: { type: 'json', separator: ',' }
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' }
  }
})

const logger = log4js.getLogger()

export default logger
