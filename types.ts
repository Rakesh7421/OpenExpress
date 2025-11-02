
export enum AppVersion {
  CLIENT = 'client',
  DEVELOPER = 'developer',
}

export enum ElementType {
  TEXT = 'text',
  SHAPE = 'shape',
  IMAGE = 'image',
}

export enum ShapeType {
  RECTANGLE = 'rectangle',
  ELLIPSE = 'ellipse',
}

export interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface TextElement extends DesignElement {
  type: ElementType.TEXT;
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
}

export interface ShapeElement extends DesignElement {
  type: ElementType.SHAPE;
  shapeType: ShapeType;
  backgroundColor: string;
}

export interface ImageElement extends DesignElement {
  type: ElementType.IMAGE;
  src: string;
}

export interface Post {
    id: string;
    platform: string;
    accountId: string;
    accountName: string;
    content: string;
    scheduledAt: Date;
    status: 'scheduled' | 'posted' | 'failed';
    mediaUrl?: string;
}

// Exporting types for shared config
export type PlatformName = 'Meta' | 'X' | 'LinkedIn' | 'TikTok' | 'Instagram' | 'Pinterest';

export interface PlatformConfig {
  credentials: {
    [key: string]: string;
  };
  tokens: {
    [key: string]: string;
  };
  oauth: {
    redirect_uri: string;
    scopes: string;
  };
}

export interface BrandConfig {
  details: {
    name: string;
    logoUrl: string;
    description: string;
    postingDefaults: {
        defaultAccounts: string[]; // e.g., ['meta-12345', 'instagram-67890']
        mandatoryHashtags: string;
    };
  };
  platforms: {
    [platform: string]: {
      dev: PlatformConfig;
      live: PlatformConfig;
    };
  };
}
