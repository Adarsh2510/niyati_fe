import { useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { excalidrawRefAtom } from './atoms';
import { useAtom } from 'jotai';
import { ExcalidrawAPI } from './utils';

const WhiteboardCanvas = () => {
  const [initialData] = useState({
    elements: [],
    appState: {
      viewBackgroundColor: '#ffffff',
    },
    scrollToContent: true,
  });
  const [excalidrawRef] = useAtom(excalidrawRefAtom);

  return (
    <div className="w-full h-full flex flex-row">
      <div
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgb(170, 162, 162)',
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <Excalidraw
          excalidrawAPI={api => {
            excalidrawRef.current = api as unknown as ExcalidrawAPI;
          }}
          initialData={initialData as any}
          name="Whiteboard"
          aiEnabled={false}
          UIOptions={{
            canvasActions: {
              export: false,
              saveAsImage: false,
              saveToActiveFile: false,
              loadScene: false,
              clearCanvas: true,
            },
          }}
        />
      </div>
    </div>
  );
};

export default WhiteboardCanvas;
