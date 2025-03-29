const { contextBridge, ipcRenderer } = require('electron/renderer')

/**
 * @type {{
 *   loadModel: () => Promise<string>,
 *   aiResponse: (userPrompt: string) => void,
 *   aiResponseStream: (callback: (response: string) => void) => void,
 *   ejectModel: () => void,
 *   removeAIResponseStreamListeners: () => void
 * }}
 */
const api = {
    loadModel: () => ipcRenderer.invoke("givePath"),
    aiResponse: (userPrompt) => ipcRenderer.send("aiResponse", userPrompt),
    aiResponseStream: (callback) => ipcRenderer.on("aiResponseStream", (_, response) => callback(response)),
    ejectModel: () => ipcRenderer.invoke("eject"),
    removeAIResponseStreamListeners: () => ipcRenderer.removeAllListeners("aiResponseStream")
}

contextBridge.exposeInMainWorld("backend", api)
