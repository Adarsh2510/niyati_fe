import { useRef, useState } from 'react';
import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/services/cloudinary';
import { userImageResponseAtom } from './atoms';
import { useSetAtom } from 'jotai';
import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';

const WhiteboardCanvas = () => {
  const excalidrawRef = useRef<any>(null);
  const [initialData] = useState({
    elements: [],
    appState: {
      viewBackgroundColor: '#ffffff',
    },
    scrollToContent: true,
  });
  const setUserImageResponse = useSetAtom(userImageResponseAtom);

  const handleSave = async () => {
    if (excalidrawRef.current) {
      try {
        const elements = excalidrawRef.current.getSceneElements();

        const blob = await exportToBlob({
          elements,
          appState: {
            ...excalidrawRef.current.getAppState(),
            exportWithDarkMode: false,
            exportEmbedScene: false,
            exportBackground: true,
          },
          files: excalidrawRef.current.getFiles(),
          mimeType: 'image/jpeg',
          quality: 0.9,
        });

        const file = new File([blob], 'whiteboard.jpeg', { type: 'image/jpeg' });

        const imageUrl = await uploadImage(
          file,
          `whiteboard_response-${Date.now() + Math.random().toString(36).substring(0, 8)}`
        );

        setUserImageResponse(imageUrl);
        toast.success('Whiteboard image saved successfully!');
      } catch (error) {
        sendLog({
          message: 'Error saving whiteboard image',
          err: error as Error,
          level: ELogLevels.Error,
        });
        toast.error('Error saving image. Please try again!');
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-row">
      <div className="flex flex-col items-center gap-2 p-2 pl-4 pb-4">
        <Button variant="default" size="icon" onClick={handleSave} title="Save">
          <Save className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 bg-white p-2 rounded-lg" style={{ height: 'calc(100% - 16px)' }}>
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
            excalidrawAPI={api => (excalidrawRef.current = api)}
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
    </div>
  );
};

export default WhiteboardCanvas;
