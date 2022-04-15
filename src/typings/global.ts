import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { CanvasDirection } from "reaflow";

export interface StorageConfig {
  layout: CanvasDirection;
  expand: boolean;
  autoformat: boolean;
  hideEditor: boolean;
  searchNode: string;
  zoomPanPinch: ReactZoomPanPinchRef | null;
  lightmode: boolean;
}
