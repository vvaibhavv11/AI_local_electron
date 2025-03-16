import { dialog, OpenDialogOptions } from "electron";

export async function openFile() {
    const dialogOption: OpenDialogOptions = {
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
