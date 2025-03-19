const { contextBridge, ipcRenderer } = require('electron/renderer')

/**
 * @type {{
 *   loadModel: () => Promise<string>,
 *   aiResponse: (userPrompt: string) => void,
 *   aiResponseStream: (callback: (response: string) => void) => void
 * }}
 */
const api = {
    loadModel: () => ipcRenderer.invoke("givePath"),
    aiResponse: (userPrompt) => ipcRenderer.send("aiResponse", userPrompt),
    aiResponseStream: (callback) => ipcRenderer.on("aiResponseStream", (_, response) => callback(response))
}

contextBridge.exposeInMainWorld("backend", api)
