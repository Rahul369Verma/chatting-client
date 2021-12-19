import { useReducer, createContext } from "react";


// initial State
const initialState = {
  socket: null
}

// create Context
const SocketContext = createContext()

// root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case "Change":
            return {
              socket: action.payload
            }
        case "Empty":
          return{
            socket: null
          }
        default:
            return state
    }
}

// context Provider
const SocketProvider = ({ children }) => {
    const [socket, socketDispatch] = useReducer(rootReducer, initialState)

    return (
        <SocketContext.Provider value={{ socket, socketDispatch }}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider }