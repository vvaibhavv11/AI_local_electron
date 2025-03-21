import { getLlama, LlamaChatSession, LlamaContext, LlamaModel } from "node-llama-cpp"
import { openFile } from "../api/fileOpen.js";
import { BrowserWindow } from "electron";

/**
* @typedef {object} appState
* @property {LlamaModel} [model]
* @property {LlamaContext} [context]
* @property {LlamaChatSession} [session]
*/

/**
* @type {appState} state
*/
export const state = {};

export const loadModel = async () => {
    const llama = await getLlama();
    const pathObject = await openFile();
    if (pathObject.canceled) {
        return
    }
    const path = pathObject.filePaths[0];
    const model = await llama.loadModel({ modelPath: path, gpuLayers: 0, useMlock: true });
    const context = await model.createContext({
        contextSize: 4096, threads: {
            ideal: 4, min: 2
        }
    });
    state.model = model;
    state.context = context;
    return true;
}

/**
* @param {BrowserWindow} window
* @param {string} userPrompt
*/
export const response = async (window, userPrompt) => {
    if (state.context === undefined) {
        return "error"
    };

    if (state.session === undefined) {
        state.session = new LlamaChatSession({
            contextSequence: state.context.getSequence()
        });
    };

    return state.session.prompt(userPrompt, {
        /**
        * @param {import("node-llama-cpp").LlamaChatResponseChunk} chunk
        */
        onResponseChunk: (chunk) => {
            window.webContents.send("aiResponseStream", chunk)
        }
    });
}
