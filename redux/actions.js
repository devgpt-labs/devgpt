import * as actionTypes from "./actionTypes";

export const settingsChanged = (value) => {
  return {
    type: actionTypes.SETTINGS_CHANGED,
    payload: value,
  };
};
