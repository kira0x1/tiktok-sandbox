import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import path from 'path'
import { EventEmitter } from 'stream'

export default class MainWindow {
  protected settings: Electron.BrowserWindowConstructorOptions = {
    width: 1400,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  }

  public window!: Electron.BrowserWindow | null
  public onEvent: EventEmitter = new EventEmitter()

  public constructor(settings?: Electron.BrowserWindowConstructorOptions) {
    if (settings) {
      this.settings = settings
    }

    ipcMain.handle('cookiedb:getCookies', () => {
      console.log('meow meow cookies meow')
    })

    ipcMain.handle('dark-mode:toggle', () => {
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
      } else {
        nativeTheme.themeSource = 'dark'
      }

      return nativeTheme.shouldUseDarkColors
    })

    ipcMain.handle('dark-mode:system', () => {
      nativeTheme.themeSource = 'system'
    })

    app.whenReady().then(() => {
      // Set app user model id for windows
      electronApp.setAppUserModelId('com.electron')

      // Default open or close DevTools by F12 in development
      // and ignore CommandOrControl + R in production.
      // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
      app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
      })

      this.onEvent.emit('ready')
      this.createWindow()
      this.onEvent.emit('window-created')
    })

    app.on('window-all-closed', this.onWindowAllClosed)
  }

  protected createWindow(): void {
    nativeTheme.themeSource = 'dark'
    this.window = new BrowserWindow(this.settings)

    this.window.on('ready-to-show', () => {
      if (this.window) this.window.show()
    })

    this.window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.window.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

    this.window.on('closed', this.onClose)
  }

  protected onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  protected onClose(): void {
    this.window = null
  }
}
