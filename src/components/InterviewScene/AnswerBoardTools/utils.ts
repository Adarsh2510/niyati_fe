import { MutableRefObject } from 'react';

import { exportToBlob } from '@excalidraw/excalidraw';
import { uploadImage } from '@/lib/services/cloudinary';
import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';

// This interface matches the minimum API surface we need from Excalidraw
export interface ExcalidrawAPI {
  getSceneElements: () => any[];
  getAppState: () => any;
  getFiles: () => any;
  updateScene?: (scene: any) => void;
}

// Create a mutable ref that can be safely updated
export const createExcalidrawRef = () => {
  const ref: MutableRefObject<ExcalidrawAPI | null> = {
    current: null,
  };

  return ref;
};

export const optimizeImage = async (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');

      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;

      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }
      if (height > MAX_HEIGHT) {
        width = Math.round(width * (MAX_HEIGHT / height));
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality

      resolve(optimizedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for optimization'));
    };

    img.src = dataUrl;
  });
};

export const generateWhiteboardImageUrl = async (
  excalidrawRef: MutableRefObject<ExcalidrawAPI | null>
): Promise<string | undefined> => {
  if (!excalidrawRef) return undefined;

  try {
    // Access the excalidrawRef.current object instead of using excalidrawRef directly
    const excalidrawAPI = excalidrawRef.current;

    if (!excalidrawAPI) return undefined;

    const elements = excalidrawAPI.getSceneElements();

    // Don't generate image if canvas is empty
    if (elements.length === 0) return;

    const blob = await exportToBlob({
      elements,
      appState: {
        ...excalidrawAPI.getAppState(),
        exportWithDarkMode: false,
        exportEmbedScene: false,
        exportBackground: true,
      },
      files: excalidrawAPI.getFiles(),
      mimeType: 'image/jpeg',
      quality: 0.9,
    });

    const file = new File([blob], 'whiteboard.jpeg', { type: 'image/jpeg' });

    const imageUrl = await uploadImage(
      file,
      `whiteboard_response-${Date.now() + Math.random().toString(36).substring(0, 8)}`
    );

    return imageUrl;
  } catch (error) {
    sendLog({
      message: 'Error generating whiteboard image',
      err: error as Error,
      level: ELogLevels.Error,
    });
    return undefined;
  }
};
