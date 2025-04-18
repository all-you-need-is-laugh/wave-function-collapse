type ImageErrorEvent = Parameters<NonNullable<HTMLImageElement['onerror']>>[0];

export async function readImageData(src: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = (
      _event: ImageErrorEvent,
      _source?: string,
      _lineno?: number,
      _colno?: number,
      error?: Error,
    ) => {
      if (error) {
        reject(error);
        return;
      }

      reject(new Error(`Failed to load image: ${src}`));
    };
  });
}
