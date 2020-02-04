'use strict'

import { app, BrowserWindow } from 'electron'
import taskStorage from './taskStorage'
import deployStorage from './deployStorage'
import logStorage from './logStorage'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  logStorage.info('开始初始化【备份计划】本地存储')
  taskStorage.initDB().then(res => {
    logStorage.info('结束初始化【备份计划】本地存储')
    logStorage.info('开始初始化【部署计划】本地存储')
    return deployStorage.initDB()
  }).then(res => {
    logStorage.info('结束初始化【部署计划】本地存储')
    logStorage.info('开始初始化【Electron】渲染进程')
    mainWindow = new BrowserWindow({
      height: 563,
      useContentSize: true,
      width: 1000
    })

    mainWindow.loadURL(winURL)
    logStorage.info('开始加载主页面')
    mainWindow.on('closed', () => {
      mainWindow = null
    })
  })
  BrowserWindow.addExtension('C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\5.3.3_0')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
