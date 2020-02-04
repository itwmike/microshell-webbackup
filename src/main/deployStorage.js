const Datastore = require('nedb')

// 实例化连接对象（不带参数默认为内存数据库）
const deployDB = new Datastore({
  filename: './data/deploy.db',
  autoload: true
})

/**
 *  初始化数据库
 */
function initDB () {
  let doc = {
    ftpInfo: {
      host: '',
      name: '',
      password: '',
      port: 21
    },
    deploys: []
  }
  return this.getDeployList().then(res => {
    if (!res || res.length === 0) {
      return this.inserDeploy(doc)
    }
  })
}

/**
 * 获取所有的部署信息
 * @returns {Promise<any>}
 */
function getDeployList () {
  return new Promise((resolve, reject) => {
    deployDB.find({
    }).exec((err, docs) => {
      if (err) {
        reject(err)
      } else {
        resolve(docs)
      }
    })
  })
}

/**
 * 添加部署信息
 * @param doc
 * @returns {Promise<any>}
 */
function inserDeploy (doc) {
  return new Promise((resolve, reject) => {
    deployDB.insert(doc, (err, newDoc) => {
      if (err) {
        reject(err)
      } else {
        resolve(newDoc)
      }
    })
  })
}

/**
 * 更新ftp配置信息
 * @param _id
 * @param ftpInfo
 * @returns {Promise<any>}
 */
function updateFtpInfo (_id, ftpInfo) {
  return new Promise((resolve, reject) => {
    deployDB.update({_id: _id}, {$set: {ftpInfo: ftpInfo}}, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 *  插入部署计划
 * @param _id
 * @param data
 * @returns {Promise<any>}
 */
function insertDeployPlan (_id, data) {
  data.lastDeployTime = null
  data.sort = new Date().getTime()
  data.counter = 0
  return new Promise((resolve, reject) => {
    deployDB.update({_id: _id}, { $push: { deploys: data } }, {}, (err, newDoc) => {
      if (err) {
        reject(err)
      } else {
        resolve(newDoc)
      }
    })
  })
}

/**
 * 删除部署计划
 * @param _id
 * @param data
 * @returns {Promise<any>}
 */
function deleteDeployPlan (_id, data) {
  return new Promise((resolve, reject) => {
    deployDB.update({_id: _id}, { $pull: {deploys: data} }, {}, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 更新部署计划
 * @param _id
 * @param data
 * @returns {Promise<any>}
 */
function updateDeployPlan (_id, data) {
  return new Promise((resolve, reject) => {
    deployDB.update({_id: _id}, {$pull: { deploys: {name: data.name} }}, {}, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        deployDB.update({_id: _id}, {$push: {deploys: data}}, (err, doc) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        })
      }
    })
  })
}

export default {
  initDB,
  getDeployList,
  inserDeploy,
  updateFtpInfo,
  insertDeployPlan,
  deleteDeployPlan,
  updateDeployPlan
}
