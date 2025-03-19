import path from 'path';
import { app } from 'electron';

export function getPreloadPath() {
    return path.join(
        app.getAppPath(),
        "/src/electron/src/preload.cjs"
    )
}
