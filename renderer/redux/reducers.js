import * as actionTypes from "./actionTypes";

const initialState = {
  theme: "Normal",
  localRepoDirectory: "",
  technologiesUsed: "",
  isSettingsOpen: false,
  context: "",
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SETTINGS_CHANGED:
      return {
        ...state,
        theme: action.payload?.theme || state.theme,
        localRepoDirectory:
          action.payload?.localRepoDirectory || state.localRepoDirectory,
        technologiesUsed:
          action.payload?.technologiesUsed || state.technologiesUsed,
        isSettingsOpen: action.payload?.isSettingsOpen || state.isSettingsOpen,
        context: action.payload?.context || state.context,
      };
    default:
      return state;
  }
};

export default mainReducer;
