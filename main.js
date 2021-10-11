const electron = require('electron')
const url = require('url')
const path = require('path')

var mysql = require('mysql')

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'JonasWalker',
  password: 'jonas1999',
  database: 'Moneyz',
})

connection.connect()

connection.query(
  'SELECT salary FROM moneyz.accountinfo',
  function (error, results, fields) {
    if (error) throw error
    console.log(results)
  }
)

connection.end()

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow
let addWindow
var addIncome

// Listen for app to be ready
app.on('ready', function () {
  // Create new window
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(dirname, 'mainWindow.html'),
      protocol: 'file',
      slashes: true,
      // this is passing this === file://dirname/mainWindow.html into load url
    })
  )
})
