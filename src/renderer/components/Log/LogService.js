import path from 'path'
import fs from 'fs'

/**
 * 获取日志
 * @param date
 * @returns {Promise<any>}
 */
function getLog (date, level) {
  return new Promise((resolve, reject) => {
    let filter = ''
    if (date) {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      if (m < 9) {
        m = '0' + m
      }
      if (d < 9) {
        d = '0' + d
      }
      filter = `log.${y}-${m}-${d}.json`
    }
    let files = fs.readdirSync(path.join('./logs'))
    let logs = []
    files.forEach((file) => {
      if (filter && file !== filter) return true
      let text = fs.readFileSync(path.join('./logs', file)).toString()
      if (text.trim().endsWith(',')) {
        text = text.substr(0, text.trim().length - 1)
      }
      text = JSON.parse('[' + text + ']')
      logs = logs.concat(text)
    })
    if (level) {
      logs = logs.filter((t) => t.level.levelStr === level)
    }
    if (date && (date.getHours() > 0 || date.getMinutes() > 0)) {
      console.log('时分')
      // 结果精确到 时分
      logs = logs.filter((t) => new Date(t.startTime) > date)
    }
    resolve(logs)
  })
}

export default {
  getLog
}
