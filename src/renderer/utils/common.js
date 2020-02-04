import path from 'path'
import fs from 'fs'

/**
 * 递归创建目录 同步方法。win 下 node API 不支持递归，只能自己写递归方法
 * @param dirname
 * @returns {boolean}
 */
function mkdirsSync (dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

/**
 * 递归删除目录
 * @param filePath
 */
function rmdirSync (filePath) {
  let stat = fs.statSync(filePath)
  if (stat.isFile()) {
    fs.unlinkSync(filePath)
  } else {
    let dirs = fs.readdirSync(filePath)
    dirs.map(dir => rmdirSync(path.join(filePath, dir)))
    fs.rmdirSync(filePath)
  }
}

/**
 * 递归拷贝文件
 * @param tempDirectory 临时目录
 * @param source 源文件目录
 * @rules rules 忽略的文件
 */
function copyFileToTempDirectory (tempDirectory, source, rules) {
  let paths = fs.readdirSync(source) // 同步读取当前目录
  paths.forEach(function (pathItem) {
    let _src = path.join(source, pathItem)
    let _dst = path.join(tempDirectory, pathItem)
    // 判断目录或文件是否被忽略
    if (rules.indexOf(_src) > -1) {
      return true
    }
    let stats = fs.statSync(_src)
    if (stats.isFile()) { // 如果是个文件则拷贝
      fs.copyFileSync(_src, _dst)// 创建读取流
    } else if (stats.isDirectory()) { // 是目录则 递归
      mkdirsSync(_dst)
      copyFileToTempDirectory(_dst, _src, rules)
    }
  })
}

export default {
  mkdirsSync,
  rmdirSync,
  copyFileToTempDirectory
}
