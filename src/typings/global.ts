import React, { PropsWithChildren } from "react";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { CanvasDirection } from "reaflow";

export interface StorageConfig {
  layout: CanvasDirection;
  expand: boolean;
  hideEditor: boolean;
  zoomPanPinch?: ReactZoomPanPinchRef;
  lightmode: boolean;
  performance: boolean;
}

export type ReactComponent = React.FC<PropsWithChildren<{}>>;
