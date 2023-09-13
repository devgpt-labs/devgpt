import * as actionTypes from "./actionTypes";

const initialState = {
  theme: "Normal",
  isSettingsOpen: false,
  repos: [],
  selectedRepo: {
    localRepoDirectory: "",
    technologiesUsed: "",
    context: ""
  }
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SETTINGS_CHANGED:
      return {
        ...state,
        theme: action.payload?.theme || state.theme,
        isSettingsOpen: action.payload?.isSettingsOpen || state.isSettingsOpen,
      };
    case actionTypes.MOUNT_REPOS:
      return {
        ...state,
        repos: action.payload,
        selectedRepo: action.payload[0]
      }
    case actionTypes.REMOVE_REPO:
      return {
        ...state,
        repos: state.repos.filter(repo => repo.id !== action.payload)
      }
    case actionTypes.ADD_REPO:
      console.log({
        ...state,
        repos: [...state.repos, action.payload]
      });

      return {
        ...state,
        repos: [...state.repos, action.payload]
      }
    case actionTypes.SELECT_REPO:
      return {
        ...state,
        selectedRepo: action.payload
      }
    default:
      return state;
  }
};

export default mainReducer;
