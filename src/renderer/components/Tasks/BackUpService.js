import path from 'path'
import fs from 'fs'
import compressing from 'compressing'
import taskStorage from '../../../main/taskStorage'
import common from '@/utils/common'
import logStorage from '../../../main/logStorage'

/**
 *  备份
 * @param data
 * @returns {Promise<boolean>}
 */
function back (data) {
  logStorage.info('开始执行备份计划')
  if (!fs.existsSync(data.source)) {
    return Promise.reject(new Error('源目录不存在'))
  }
  if (data.source.endsWith('\\')) {
    data.source = data.source.substr(0, data.source.length - 1)
  }
  let zipName = data.source.substr(data.source.lastIndexOf('\\')) // 压缩文件名
  let nowDate = new Date()
  let zipDirectory = `${nowDate.getFullYear()}-${nowDate.getMonth() + 1}-${nowDate.getDate()}-${nowDate.getHours()}-${nowDate.getMinutes()}`
  let zipPath = path.join(data.target, zipDirectory)
  if (!fs.existsSync(zipPath)) {
    common.mkdirsSync(zipPath)
  }
  logStorage.info('备份文件存储目录：' + zipPath)
  let result = false
  if (data.rules && data.rules.length > 0) {
    logStorage.info('备份计划设置了忽略规则，将需要备份的文件拷贝到临时目录，然后对临时目录进行压缩')
    // 有忽略文件，需要特殊处理。先递归将文件拷贝下临时目录，然后对临时目录进行压缩
    let tempDirectory = path.join('./temp', zipDirectory, zipName)
    common.mkdirsSync(tempDirectory)
    let rules = []
    data.rules.forEach(item => {
      rules.push(path.join(data.source, item.path))
    })
    common.copyFileToTempDirectory(tempDirectory, data.source, rules)
    logStorage.info(`文件拷贝完成，开始对临时目录：${tempDirectory} 进行压缩。`)
    result = compressingFile(tempDirectory, path.join(zipPath, `${zipName}.zip`)).then(() => {
      logStorage.info('文件压缩完成，删除临时目录。')
      common.rmdirSync(path.join('./temp', zipDirectory)) // 删除临时目录
      logStorage.info('临时目录删除完成。')
    })
  } else {
    logStorage.info(`开始对源目录：${data.source} 进行压缩：`)
    result = compressingFile(data.source, path.join(zipPath, `${zipName}.zip`)).then(res => {
      logStorage.info('文件压缩完成。')
      return true
    })
  }
  return result.then(() => {
    logStorage.info('备份计划增加一条历史记录数据')
    logStorage.info('更新备份计划的最后修改时间')
    return saveBackRecord(data, path.join(zipPath, `${zipName}.zip`))
  })
}

/**
 * 压缩文件
 * @param source
 * @param zipPath
 * @returns {Promise<void>}
 */
function compressingFile (source, zipPath) {
  return compressing.zip.compressDir(source, zipPath)
}

/**
 * 保存备份记录
 * @param _id
 * @param zipPath
 * @returns {Promise<*>}
 */
function saveBackRecord (data, zipPath) {
  let history = {
    zipPath: zipPath,
    createTime: new Date()
  }
  let stats = fs.statSync(zipPath)
  history.size = stats.size
  return taskStorage.saveBackRecord(data._id, history)
}

/**
 * 还原备份
 * @param source
 * @param target
 * @returns {Promise<void>}
 */
function unPack (source, target) {
  let tempTarget = target.substr(0, target.lastIndexOf('\\'))
  return compressing.zip.uncompress(source, tempTarget)
}

export default {
  back,
  unPack
}
