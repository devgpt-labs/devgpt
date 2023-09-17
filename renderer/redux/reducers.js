import * as actionTypes from "./actionTypes";

const initialState = {
  localRepoDirectory: "",
  technologiesUsed: "",
  context: "",
  theme: "Normal",
  isSettingsOpen: false,
  isAITalking: false,
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SETTINGS_CHANGED:
      return {
        ...state,
        localRepoDirectory:
          action.payload?.localRepoDirectory || state.localRepoDirectory,
        technologiesUsed:
          action.payload?.technologiesUsed || state.technologiesUsed,
        context: action.payload?.context || state.context,
        theme: action.payload?.theme || state.theme,
        isSettingsOpen: action.payload?.isSettingsOpen || state.isSettingsOpen,
        isAITalking: action.payload?.isAITalking || state.isAITalking,
      };
    default:
      return state;
  }
};

export default mainReducer;
