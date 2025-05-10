import { useState, Suspense, lazy } from 'react';
import { useAtom } from 'jotai';
import { excalidrawRefAtom } from './atoms';
import { ExcalidrawAPI } from './utils';

// Lazy load the Excalidraw component
const Excalidraw = lazy(() =>
  import('@excalidraw/excalidraw').then(module => ({
    default: module.Excalidraw,
  }))
);

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
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-500">Loading whiteboard...</div>
            </div>
          }
        >
          <Excalidraw
            excalidrawAPI={(api: unknown) => {
              if (excalidrawRef) {
                excalidrawRef.current = api as ExcalidrawAPI;
              }
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
        </Suspense>
      </div>
    </div>
  );
};

export default WhiteboardCanvas;
