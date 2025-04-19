// Type definitions for Excalidraw
declare module '@excalidraw/types' {
  export interface ExcalidrawImperativeAPI {
    getSceneElements: () => any[];
    getAppState: () => any;
    getFiles: () => any;
    updateScene: (scene: any) => void;
    // Add other methods as needed
  }
}
