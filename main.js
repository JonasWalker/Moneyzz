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
      pathname: path.join(__dirname, 'doughnutPie.html'),
      protocol: 'file',
      slashes: true,
      // this is passing this === file://dirname/mainWindow.html into load url
    })
  )

  mainWindow.on('closed', function () {
    app.quit()
  })

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  // Insert Menu
  Menu.setApplicationMenu(mainMenu)
})

// Handle create add window
function createAddWindow(_xwindow, _title) {
  // Create new window
  _xwindow = _xwindow + '.html'
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: _title,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // Load html into Window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, _xwindow),
      protocol: 'file',
      slashes: true,
      // this is passing this === file://dirname/addWindow.html into load url
    })
  )

  // Garbage collection handle
  addWindow.on('close', function () {
    addWindow = null
  })
}

// Catch item:add
ipcMain.on('item:add', function (e, item) {
  mainWindow.webContents.send('item:add', item)
  addWindow.close()
})

// Create menu template
const mainMenuTemplate = [
  {
    label: 'Add',
    submenu: [
      {
        label: 'Add Income',
        click() {
          createAddWindow('addIncome', 'Add a New Income')
        },
      },
      {
        label: 'Add Mortgage',
      },
      {
        label: 'Add Bill',
        click() {
          mainWindow.webContents.send('item:clear')
        },
      },
      /*{
        label: 'Quit',
        // this is a short cut to close app. checks if mac or windows
        accelerator: process.plateform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        },
      },*/
    ],
    /*label: 'Clear',
    submenu: [
      {
        label: 'Clear Income',
        click() {
          createAddWindow()
        },
      },
      {
        label: 'Clear Bill',
        click() {
          mainWindow.webContents.send('item:clear')
        },
      },
      // {
      //   label: 'Quit',
      //   // this is a short cut to close app. checks if mac or windows
      //   accelerator: process.plateform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      //   click() {
      //     app.quit()
      //   },
      // },
    ],*/
  },
]

mainMenuTemplate.push({
  label: 'Clear',
  submenu: [
    {
      label: 'Clear Income',
      click() {
        //createAddWindow()
      },
    },
    {
      label: 'Clear Mortgage',
    },
    {
      label: 'Clear Bill',
      click() {
        //mainWindow.webContents.send('item:clear')
      },
    },
    // {
    //   label: 'Quit',
    //   // this is a short cut to close app. checks if mac or windows
    //   accelerator: process.plateform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    //   click() {
    //     app.quit()
    //   },
    // },
  ],
})

// If mac, add empty object to menu
if (process.plateform == 'darwin') {
  mainMenuTemplate.unshift({})
}

// Add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        // this is a short cut to close app. checks if mac or windows
        accelerator: process.plateform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        },
      },
      {
        role: 'reload',
      },
    ],
  })
}
