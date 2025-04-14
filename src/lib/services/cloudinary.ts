import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';
import { fetchWithAuth } from '@/utils/apiBE';

/**
 * Uploads an image to Cloudinary through our secure API
 * @param file - The file to upload
 * @param filename - The filename to use for the image
 * @returns The URL of the uploaded image
 */
export async function uploadImage(file: File, filename: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);

    // Use fetchWithAuth utility which handles auth token automatically
    const response = await fetchWithAuth(
      '/api/cloudinary',
      {
        method: 'POST',
        body: formData,
      },
      true
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    sendLog({ err: error as Error, level: ELogLevels.Error });
    throw new Error('Failed to upload image');
  }
}

/**
 * Deletes an image from Cloudinary through our secure API
 * @param publicId - The public ID of the image to delete
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    // Use fetchWithAuth utility which handles auth token automatically
    const response = await fetchWithAuth('/api/cloudinary', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete image');
    }
  } catch (error) {
    sendLog({ err: error as Error, level: ELogLevels.Error });
    throw new Error('Failed to delete image');
  }
}

/**
 * Gets a Cloudinary image URL
 * @param publicId - The public ID of the image
 * @returns The Cloudinary image URL
 */
export function getImageUrl(publicId: string): string {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/interview-room/${publicId}`;
}
