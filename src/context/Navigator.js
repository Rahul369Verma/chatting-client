import { useReducer, createContext } from "react";


// initial State
const initialState = {
  selected: "chat"
}

// create Context
const NavigatorContext = createContext()

// root reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        selected: action.payload
      }
    default:
      return state
  }
}

// context Provider
const NavigatorProvider = ({ children }) => {
  const [navigator, navigatorDispatch] = useReducer(rootReducer, initialState)

  return (
    <NavigatorContext.Provider value={{ navigator, navigatorDispatch }}>
      {children}
    </NavigatorContext.Provider>
  )
}

export { NavigatorContext, NavigatorProvider }