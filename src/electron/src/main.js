import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { ejectModel, loadModel, response, resetSession } from './llamacpp/model.js';

/**
 * Creates the main application window and sets up IPC handlers when the app is ready.
 */
app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        height: 720,
        width: 1280,
        minWidth: 800,
        minHeight: 500,
        backgroundColor: '#0a0a0f',
        title: 'AI Local',
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
        try {
            const done = await loadModel();
            return done;
        } catch (error) {
            console.error('Error loading model:', error);
            mainWindow.webContents.send('aiResponseError', {
                message: error instanceof Error ? error.message : 'Failed to load model'
            });
            return false;
        }
    });

    /**
     * Handles the 'eject' IPC event by ejecting the model and returning the result.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the model was ejected successfully.
     */
    ipcMain.handle('eject', async () => {
        try {
            const done = await ejectModel();
            return done;
        } catch (error) {
            console.error('Error ejecting model:', error);
            return false;
        }
    })

    /**
     * Handles the 'resetSession' IPC event by resetting the chat session.
     * @returns {boolean}
     */
    ipcMain.handle('resetSession', () => {
        try {
            return resetSession();
        } catch (error) {
            console.error('Error resetting session:', error);
            return false;
        }
    });

    /**
     * Handles the 'aiResponse' IPC event by generating a response based on the provided prompt.
     * @param {Electron.IpcMainEvent} event - The IPC event object.
     * @param {string} prompt - The prompt string to generate a response for.
     */
    ipcMain.on("aiResponse", async (event, prompt) => {
        try {
            await response(mainWindow, prompt);
            mainWindow.webContents.send("aiResponseDone");
        } catch (error) {
            console.error('Error generating response:', error);
            mainWindow.webContents.send("aiResponseError", {
                message: error instanceof Error ? error.message : 'Failed to generate response'
            });
        }
    });

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5500");
    } else {
        // Menu.setApplicationMenu(null);
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    }
});
