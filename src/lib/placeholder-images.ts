import allImages from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Asegurarse de que sea realmente un array
export const placeholderImages: ImagePlaceholder[] = Array.isArray(allImages)
  ? allImages
  : []; // <-- fallback si allImages no es un array
