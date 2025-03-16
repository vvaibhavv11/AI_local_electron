// import { contextBridge } from "electron";
const { contextBridge, ipcRenderer } = require('electron/renderer')


contextBridge.exposeInMainWorld("backend", {
    loadModel: () => ipcRenderer.invoke("givePath"),
    aiResponse: (userPrompt: string) => ipcRenderer.send("aiResponse", userPrompt),
    aiResponseStream: (callback: Function) => ipcRenderer.on("aiResponseStream", (_: Event, response: string) => callback(response))
})
