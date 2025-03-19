import { dialog } from "electron";

export async function openFile() {
    /**
    * @type {import('electron').OpenDialogOptions}
    */
    const dialogOption = {
        title: "select the model gguf",
        filters: [{
            name: "gguf",
            extensions: ["gguf"]
        }],
        properties: ["openFile"]
    };
    const modelPath = await dialog.showOpenDialog(dialogOption);
    return modelPath;
}
