import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { loadModel, response } from './llamacpp/model.js';

app.on("ready", () => {
    const mainWindows = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath()
        }
    });

    ipcMain.handle('givePath', async () => {
        const done = await loadModel();
        // console.log(done)
        return done
    })

    ipcMain.on("aiResponse", async (_, prompt: string) => {
        await response(mainWindows, prompt)
    })

    switch (isDev()) {
        case true:
            mainWindows.loadURL("http://localhost:5500");
            break
        default:
            mainWindows.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    }
})
