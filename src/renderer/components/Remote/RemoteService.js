import Ftp from 'ftp'
import fs from 'fs'
import common from '@/utils/common'
import path from 'path'
import Shell from 'node-powershell'
import deployStorage from '../../../main/deployStorage'
import backUpService from '../Tasks/BackUpService'
import taskStorage from '../../../main/taskStorage'
import logStorage from '../../../main/logStorage'

/**
 * 测试连接状态
 * @param ftpInfo
 * @returns {Promise<boolean | never>}
 */
function testConnect (ftpInfo) {
  return connect(ftpInfo).then(res => {
    res.client.end()
    return true
  })
}

/**
 *  创建连接对象，返回连接实例,使用完请手动释放
 * @param ftpInfo
 * @returns {Promise<any>}
 */
function connect (ftpInfo) {
  return new Promise((resolve, reject) => {
    let client = new Ftp()
    client.on('ready', function () {
      resolve({client})
    })
    client.on('error', function (err) {
      reject(err)
    })
    client.connect({
      host: ftpInfo.host,
      port: ftpInfo.port,
      user: ftpInfo.name,
      password: ftpInfo.password
    })
  })
}

/**
 * 一键部署
 * @param ftpInfo
 * @param data
 * @returns {Promise<{client: *} | never>}
 */
function deploy (_id, ftpInfo, data) {
  logStorage.info('开始执行部署计划')
  return connect(ftpInfo).then((res) => {
    logStorage.info('FTP 服务连接成功')
    // ftp 连接成功，遍历目录下的文件开始下载
    return recursionDownFile(res.client, data.ftpDirectory).then(fileList => {
      logStorage.info('完成此次部署所需下载文件信息的计算')
      return {...res, fileList}
    }) // 返回文件路径集合
  }).then(res => {
    logStorage.info('开始从FTP下载文件')
    // 循环下载文件
    let promises = []
    let tempDirectory = path.join('./temp', new Date().getTime().toString())
    res.fileList.forEach(filePath => {
      let p1 = downFile(res.client, filePath, path.join(tempDirectory, filePath))
      promises.push(p1)
    })
    return Promise.all(promises).then(values => {
      logStorage.info('部署所需文件全部下载完成')
      res.client.end() // 关闭 ftp 连接
      return {...res, tempDirectory}
    })
  }).then(res => {
    logStorage.info('执行关联的备份计划')
    return taskStorage.getTaskById(data.taskId).then(task => {
      return backUpService.back(task)
    }).then(() => {
      logStorage.info('关联的备份计划执行完成')
      return res
    })
  }).then(res => {
    // 部署前执行一段 shell
    if (data.beforeHook) {
      logStorage.info('运行部署前钩子脚本')
      let ps = new Shell()
      ps.addCommand(path.join('./shell', data.beforeHook))
      return ps.invoke().then(output => {
        return res
      }).finally(() => {
        ps.dispose()
      })
    } else {
      return res
    }
  }).then(res => {
    logStorage.info('替换站点文件')
    // 替换站点文件
    common.mkdirsSync(data.siteDirectory)
    common.copyFileToTempDirectory(data.siteDirectory, res.tempDirectory, [])
    common.rmdirSync(res.tempDirectory)
    logStorage.info('站点文件替换完成')
    return res
  }).then(res => {
    // 部署后执行一段 shell
    if (data.afterHook) {
      logStorage.info('运行部署后钩子脚本')
      let ps = new Shell()
      ps.addCommand(path.join('./shell', data.afterHook))
      return ps.invoke().then(output => {
        return res
      }).finally(() => {
        ps.dispose()
      })
    }
    return res
  }).then(res => {
    logStorage.info('更新部署日期')
    // 更新部署日期
    let dataTemp = JSON.parse(JSON.stringify(data))
    dataTemp.lastDeployTime = new Date()
    dataTemp.counter = dataTemp.counter + 1
    return deployStorage.updateDeployPlan(_id, dataTemp).then(() => {
      return {success: true, lastDeployTime: dataTemp.lastDeployTime}
    })
  })
}

/**
 * 递归遍历FTP服务器的目录，获取下载的文件列表
 * @param client
 * @param path
 * @returns {Promise<Array | never>}
 */
function recursionDownFile (client, path) {
  return getFiles(client, path).then(data => {
    let files = []
    let promises = []
    data.forEach((item) => {
      if (item.type === '-') {
        files.push(path + '/' + item.name)
      } else if (item.type === 'd') {
        let p1 = recursionDownFile(client, path + '/' + item.name)
        promises.push(p1)
      }
    })
    return Promise.all(promises).then(values => {
      values.forEach(item => {
        files = files.concat(item)
      })
      return files
    })
  })
}

/**
 * 从FTP服务器获取文件信息
 * @param client
 * @param path
 * @returns {Promise<any>}
 */
function getFiles (client, path) {
  return new Promise((resolve, reject) => {
    client.list(path || '', function (err, list) {
      if (err) {
        reject(err)
      } else {
        resolve(list)
      }
    })
  })
}

/**
 *  从 ftp 下载文件
 * @param client
 * @param path
 * @returns {Promise<any>}
 */
function downFile (client, path, savePath) {
  savePath = savePath.replace(/\//g, '\\')
  return new Promise((resolve, reject) => {
    client.get(path, function (err, stream) {
      if (err) {
        reject(err)
      } else {
        stream.once('close', () => {
          return resolve(true)
        })
        common.mkdirsSync(savePath.substr(0, savePath.lastIndexOf('\\'))) // 创建文件的临时保存目录
        stream.pipe(fs.createWriteStream(savePath))
      }
    })
  })
}

export default {
  testConnect,
  deploy
}
