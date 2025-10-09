import allImages from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Accede directamente a la propiedad 'placeholderImages' del JSON importado.
export const placeholderImages: ImagePlaceholder[] = allImages.placeholderImages || [];
