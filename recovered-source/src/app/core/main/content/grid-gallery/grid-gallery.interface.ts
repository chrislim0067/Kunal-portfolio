/**
 * Reconstructed from template/component usage. The original interface file was
 * not in the production source map. Fields are optional and an index signature
 * is included so any property access in templates/components type-checks.
 */
export interface GridGalleryImage {
  src?: string;
  srcset?: string;
  sizes?: string;
  alt?: string;
  gifSrc?: string;
  data?: { width: number; height: number; type?: string };
  [key: string]: any;
}

export interface GridGalleryProject {
  id?: string | number;
  title?: string;
  description?: string;
  bgColor?: string;
  hasGif?: boolean;
  prevImage?: GridGalleryImage;
  images?: GridGalleryImage[];
  [key: string]: any;
}
