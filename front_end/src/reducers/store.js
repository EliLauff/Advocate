import { createStore, compose, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

const initialState = {
  language: "en",
  visible: false,
  userType: null
};

const reducer = (currentState, action) => {
  switch (action.type) {
    case "SET_LANGUAGE":
      console.log(action.payload.language);
      return {
        ...currentState,
        language: action.payload.language
      };
    case "TOGGLE_TRANSITION":
      return {
        ...currentState,
        visible: !currentState.visible
      };
    case "SELECT_USER_TYPE":
      console.log(action.payload.userType);
      return {
        ...currentState,
        userType: action.payload.userType
      };
    default:
      return { ...currentState };
  }
};

let middleware = compose(applyMiddleware(ReduxThunk));

// if (window.navigator.userAgent.includes("Chrome")) {
//   middleware = compose(
//     applyMiddleware(ReduxThunk),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   );
// }

export const store = createStore(reducer, initialState, middleware);
