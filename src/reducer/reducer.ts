import React from "react";
import { getNextLayout } from "src/containers/LiveEditor/helpers";
import { AppConfig, initialStates } from "../hocs/config";

export enum ConfigActionType {
  SET_CONFIG,
  TOGGLE_LAYOUT,
  TOGGLE_EXPAND,
  TOGGLE_AUTOFORMAT,
  TOGGLE_DOCK,
  TOGGLE_THEME,
  ZOOM_IN,
  ZOOM_OUT,
  CENTER_VIEW,
  SET_JSON,
  SET_ZOOM_PAN_PICNH_REF,
}

export type ReducerAction = {
  type: ConfigActionType;
  payload?: any;
};

export const useConfigReducer: React.Reducer<AppConfig, ReducerAction> = (
  state = initialStates,
  action
) => {
  switch (action.type) {
    case ConfigActionType.SET_CONFIG:
      return {
        ...state,
        settings: action.payload,
      };

    case ConfigActionType.TOGGLE_THEME:
      return {
        ...state,
        settings: {
          ...state.settings,
          lightmode: !state.settings.lightmode,
        },
      };

    case ConfigActionType.SET_ZOOM_PAN_PICNH_REF:
      return {
        ...state,
        settings: {
          ...state.settings,
          zoomPanPinch: action.payload,
        },
      };

    case ConfigActionType.CENTER_VIEW:
      state.settings.zoomPanPinch?.resetTransform();
      return state;

    case ConfigActionType.ZOOM_IN:
      state.settings.zoomPanPinch?.setTransform(
        state.settings.zoomPanPinch?.state.positionX,
        state.settings.zoomPanPinch?.state.positionY,
        state.settings.zoomPanPinch?.state.scale + 0.4
      );
      return state;

    case ConfigActionType.ZOOM_OUT:
      state.settings.zoomPanPinch?.setTransform(
        state.settings.zoomPanPinch?.state.positionX,
        state.settings.zoomPanPinch?.state.positionY,
        state.settings.zoomPanPinch?.state.scale - 0.4
      );
      return state;

    case ConfigActionType.TOGGLE_AUTOFORMAT:
      return {
        ...state,
        settings: {
          ...state.settings,
          autoformat: !state.settings.autoformat,
        },
      };

    case ConfigActionType.TOGGLE_DOCK:
      return {
        ...state,
        settings: {
          ...state.settings,
          hideEditor: !state.settings.hideEditor,
        },
      };

    case ConfigActionType.TOGGLE_EXPAND:
      return {
        ...state,
        settings: {
          ...state.settings,
          expand: !state.settings.expand,
        },
      };

    case ConfigActionType.TOGGLE_LAYOUT:
      return {
        ...state,
        settings: {
          ...state.settings,
          layout: getNextLayout(state.settings.layout),
        },
      };

    case ConfigActionType.SET_JSON:
      return {
        ...state,
        json: action.payload,
      };

    default:
      return state;
  }
};
