
export enum AppVersion {
  DEVELOPER = 'developer',
  CLIENT = 'client',
}

export enum ElementType {
  TEXT = 'text',
  SHAPE = 'shape',
  IMAGE = 'image',
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface TextElement extends CanvasElement {
  type: ElementType.TEXT;
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export enum ShapeType {
    RECTANGLE = 'rectangle',
    ELLIPSE = 'ellipse',
}

export interface ShapeElement extends CanvasElement {
  type: ElementType.SHAPE;
  shapeType: ShapeType;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export type DesignElement = TextElement | ShapeElement;
