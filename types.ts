export enum ToolType {
  HOME = 'HOME',
  AD_CREATOR = 'AD_CREATOR',
  LOGO_MAKER = 'LOGO_MAKER',
  SONG_CREATOR = 'SONG_CREATOR',
  THUMBNAIL_MAKER = 'THUMBNAIL_MAKER',
}

export interface GeneratedContent {
  text?: string;
  imageUrl?: string;
  audioBuffer?: AudioBuffer;
}

export interface ToolConfig {
  id: ToolType;
  name: string;
  description: string;
  icon: string;
  color: string;
}
