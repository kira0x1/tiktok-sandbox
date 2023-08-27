import { DatabaseManager } from './database'
import MainWindow from './mainWindow'

new DatabaseManager()
createMainWindow()

function createMainWindow(): void {
  const mainWindow = new MainWindow()

  mainWindow.onEvent.on('window-created', () => {
    // mainWindow.window?.webContents.openDevTools()
    // console.log('WINDOW CREATED')
  })
}
