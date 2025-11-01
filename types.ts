export enum ImageStyle {
  RUSTIC = 'Rustic/Dark',
  MODERN = 'Bright/Modern',
  SOCIAL = 'Social Media',
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  isGenerating: boolean;
  mimeType?: string;
}
