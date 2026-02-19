import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { ejectModel, loadModel, response } from './llamacpp/model.js';

/**
 * Creates the main application window and sets up IPC handlers when the app is ready.
 */
app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        height: 720,
        width: 1280,
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
        }
    });

    /**
     * Handles the 'givePath' IPC event by loading the model and returning the result.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the model was loaded successfully.
     */
    ipcMain.handle('givePath', async () => {
        const done = await loadModel();
        return done;
    });

    /**
     * Handles the 'eject' IPC event by ejecting the model and returning the result.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the model was ejected successfully.
     */
    ipcMain.handle('eject', async () => {
        const done = await ejectModel();
        return done
    })

    /**
     * Handles the 'aiResponse' IPC event by generating a response based on the provided prompt.
     * @param {Electron.IpcMainEvent} event - The IPC event object.
     * @param {string} prompt - The prompt string to generate a response for.
     */
    ipcMain.on("aiResponse", async (event, prompt) => {
        await response(mainWindow, prompt);
    });

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5500");
    } else {
        // Menu.setApplicationMenu(null);
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    }
});
