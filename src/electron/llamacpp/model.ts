import { getLlama, LlamaChatSession, LlamaContext, LlamaModel } from "node-llama-cpp"
import { openFile } from "../api/fileOpen.js";
import { BrowserWindow } from "electron";

type appState = {
    model?: LlamaModel,
    context?: LlamaContext
}

export const state: appState = {};

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

export const response = async (window: BrowserWindow, userPrompt: string) => {
    if (state.context === undefined) {
        return "error"
    };

    const session = new LlamaChatSession({
        contextSequence: state.context.getSequence()
    });

    return session.prompt(userPrompt, {
        onTextChunk: (chunk: string) => {
            window.webContents.send("aiResponseStream", chunk)
        }
    });
}
