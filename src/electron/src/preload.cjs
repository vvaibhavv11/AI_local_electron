const { contextBridge, ipcRenderer } = require('electron/renderer')

/**
 * @type {{
 *   loadModel: () => Promise<string>,
 *   aiResponse: (userPrompt: string) => void,
 *   aiResponseStream: (callback: (response: string) => void) => void,
 *   aiResponseDone: (callback: () => void) => void,
 *   aiResponseError: (callback: (error: { message: string }) => void) => void,
 *   ejectModel: () => void,
 *   resetSession: () => Promise<boolean>,
 *   removeAIResponseStreamListeners: () => void
 * }}
 */
const api = {
    loadModel: () => ipcRenderer.invoke("givePath"),
    aiResponse: (userPrompt) => ipcRenderer.send("aiResponse", userPrompt),
    aiResponseStream: (callback) => ipcRenderer.on("aiResponseStream", (_, response) => callback(response)),
    aiResponseDone: (callback) => ipcRenderer.on("aiResponseDone", () => callback()),
    aiResponseError: (callback) => ipcRenderer.on("aiResponseError", (_, error) => callback(error)),
    ejectModel: () => ipcRenderer.invoke("eject"),
    resetSession: () => ipcRenderer.invoke("resetSession"),
    removeAIResponseStreamListeners: () => {
        ipcRenderer.removeAllListeners("aiResponseStream");
        ipcRenderer.removeAllListeners("aiResponseDone");
        ipcRenderer.removeAllListeners("aiResponseError");
    }
}

contextBridge.exposeInMainWorld("backend", api)
