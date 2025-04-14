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
