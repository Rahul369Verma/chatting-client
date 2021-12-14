import { useReducer, createContext } from "react";


// initial State
const initialState = {
  searchedItem: null
}

// create Context
const SearchContext = createContext()

// root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case "Change":
            return {
              searchedItem: action.payload
            }
        case "Empty":
          return{
            searchedItem: null
          }
        default:
            return state
    }
}

// context Provider
const SearchProvider = ({ children }) => {
    const [search, searchDispatch] = useReducer(rootReducer, initialState)

    return (
        <SearchContext.Provider value={{ search, searchDispatch }}>
            {children}
        </SearchContext.Provider>
    )
}

export { SearchContext, SearchProvider }