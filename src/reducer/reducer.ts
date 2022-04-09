import React from "react";
import { getNextLayout } from "src/containers/LiveEditor/helpers";
import { AppConfig, initialStates } from "../hocs/config";

export enum ConfigActionType {
  SET_CONFIG,
  TOGGLE_LAYOUT,
  TOGGLE_EXPAND,
  TOGGLE_AUTOFORMAT,
  TOGGLE_DOCK,
  TOGGLE_SEARCH,
  ZOOM_IN,
  ZOOM_OUT,
  CENTER_VIEW,
  SET_JSON,
  SET_SEARCH_NODE,
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
      return { ...state, settings: action.payload };

    case ConfigActionType.TOGGLE_SEARCH:
      return {
        ...state,
        settings: {
          ...state.settings,
          showSearch: !state.settings.showSearch,
          ...(state.settings.showSearch && { searchNode: "" }),
        },
      };

    case ConfigActionType.SET_SEARCH_NODE:
      return {
        ...state,
        settings: {
          ...state.settings,
          searchNode: action.payload,
        },
      };

    case ConfigActionType.CENTER_VIEW:
      return {
        ...state,
        settings: { ...state.settings, transform: Math.random() },
      };

    case ConfigActionType.ZOOM_IN:
      return {
        ...state,
        settings: {
          ...state.settings,
          zoomScale: state.settings.zoomScale + 0.2,
        },
      };

    case ConfigActionType.ZOOM_OUT:
      return {
        ...state,
        settings: {
          ...state.settings,
          zoomScale: state.settings.zoomScale - 0.2,
        },
      };

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
