// 加载模块
const Datastore = require('nedb')
const fs = require('fs')

// 实例化连接对象（不带参数默认为内存数据库）
const taskDB = new Datastore({
  filename: './data/task.db', // require('path').join(__dirname, '/data/task.db'),
  autoload: true
})

/**
 *  初始化数据库
 */
function initDB () {
  let doc = {
    name: '默认任务',
    source: '',
    target: ''
  }
  return this.getTaskList().then(res => {
    if (!res || res.length === 0) {
      return this.insertTask(doc)
    }
  })
}

/**
 * 获取所有的备份任务
 * @returns {Promise<any>}
 */
function getTaskList () {
  return new Promise((resolve, reject) => {
    taskDB.find({
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
 * 添加任务
 * @param doc
 * @returns {Promise<any>}
 */
function insertTask (doc) {
  doc.rules = []
  doc.historys = []
  doc.lastBackTime = null
  return new Promise((resolve, reject) => {
    taskDB.insert(doc, (err, newDoc) => {
      if (err) {
        reject(err)
      } else {
        resolve(newDoc)
      }
    })
  })
}

/**
 *  删除任务
 * @param _id
 * @returns {Promise<void>}
 */
function deleteTask (_id) {
  return new Promise((resolve, reject) => {
    taskDB.remove({ _id: _id }, {}, (err, numRemoved) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 修改任务
 * @param doc
 * @returns {Promise<any>}
 */
function updateTask (doc) {
  return new Promise((resolve, reject) => {
    taskDB.update({ _id: doc._id }, doc, {}, (err, numRemoved) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 保存备份记录
 * @param _id
 * @param history
 * @returns {Promise<any>}
 */
function saveBackRecord (_id, history) {
  return new Promise((resolve, reject) => {
    taskDB.update({ _id: _id }, { $push: { historys: history }, $set: {lastBackTime: new Date()} }, {}, (err, numRemoved) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 获取单个任务
 * @param _id
 * @returns {Promise<any>}
 */
function getTaskById (_id) {
  return new Promise((resolve, reject) => {
    taskDB.findOne({_id: _id}, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}

/**
 * 删除备份历史记录
 * @param _id
 * @param history
 * @returns {Promise<any>}
 */
async function deleteHistory (_id, history) {
  let result = await new Promise((resolve, reject) => {
    taskDB.update({_id: _id}, { $pull: {historys: history} }, {}, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        if (fs.existsSync(history.zipPath)) {
          fs.unlink(history.zipPath, (err) => {
            if (err) reject(err)
            resolve(true)
          })
        } else {
          resolve(true)
        }
      }
    })
  })
  return result
}

/**
 * 新增任务的规则文件
 * @param _id
 * @param rule
 * @returns {Promise<any>}
 */
function addTaskRule (_id, rule) {
  return new Promise((resolve, reject) => {
    taskDB.update({ _id: _id }, { $push: { rules: rule } }, {}, (err, numRemoved) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 删除规则文件
 * @param _id
 * @param history
 * @returns {Promise<any>}
 */
function deleteRule (_id, rule) {
  return new Promise((resolve, reject) => {
    taskDB.update({_id: _id}, { $pull: {rules: rule} }, {}, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

export default {
  initDB,
  getTaskList,
  insertTask,
  deleteTask,
  updateTask,
  saveBackRecord,
  getTaskById,
  deleteHistory,
  addTaskRule,
  deleteRule
}
