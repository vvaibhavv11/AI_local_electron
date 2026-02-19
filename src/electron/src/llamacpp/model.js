import { getLlama, LlamaChatSession, LlamaContext, LlamaModel } from "node-llama-cpp"
import { openFile } from "../api/fileOpen.js";
import { BrowserWindow } from "electron";

/**
 * @typedef {object} appState
 * @property {LlamaModel} [model]
 * @property {LlamaContext} [context]
 * @property {LlamaChatSession} [session]
 * @property {string} [modelName]
 */

/**
 * @type {appState} state
 */
export const state = {};

export const loadModel = async () => {
    const llama = await getLlama();
    const pathObject = await openFile();
    if (pathObject.canceled) {
        return false;
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
    state.session = undefined;
    // Extract model filename for display
    state.modelName = path.split('/').pop()?.replace('.gguf', '') || path.split('\\').pop()?.replace('.gguf', '') || 'Unknown Model';
    return true;
}

/**
 * @returns {Promise<boolean>}
 */
export const ejectModel = async () => {
    try {
        if (state.session) {
            state.session.dispose?.();
        }
        if (state.context) {
            await state.context.dispose?.();
        }
        if (state.model) {
            await state.model.dispose?.();
        }
    } catch (e) {
        console.error('Error during model disposal:', e);
    }
    state.model = undefined;
    state.context = undefined;
    state.session = undefined;
    state.modelName = undefined;
    return true;
}

/**
 * @returns {boolean}
 */
export const resetSession = () => {
    if (state.session) {
        state.session.dispose?.();
        state.session = undefined;
    }
    return true;
}

/**
 * @param {BrowserWindow} window
 * @param {string} userPrompt
 */
export const response = async (window, userPrompt) => {
    if (state.context === undefined) {
        throw new Error("No model loaded. Please load a model first.");
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
