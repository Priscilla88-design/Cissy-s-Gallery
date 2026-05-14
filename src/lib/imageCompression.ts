/**
 * Compressed image data and metadata
 */
export interface CompressedImage {
  base64: string;
  width: number;
  height: number;
  size: number;
}

const MAX_FIRESTORE_SIZE = 1048487; // Just under 1MB
const MAX_DIMENSION = 1600;

/**
 * Resizes and compresses an image to fit within Firestore's document limit.
 */
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Iterative compression
        let quality = 0.9;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        while (base64.length > MAX_FIRESTORE_SIZE && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        if (base64.length > MAX_FIRESTORE_SIZE) {
          reject(new Error('Image is too large even after maximum compression'));
        } else {
          resolve(base64);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}
