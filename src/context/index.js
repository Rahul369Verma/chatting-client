import axios from "axios";
import Auth from '../isAuth';
import { useReducer, createContext, useEffect } from "react";


// initial State
const initialState = {
    email: sessionStorage.getItem("user")?.email || null,
    username: sessionStorage.getItem("user")?.username || null,
    type: sessionStorage.getItem("user")?.type || null
}

// create Context
const Context = createContext()

// root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            const user = action.payload
            return {
                ...state, email: user.email, username: user.username, type: user.type
            }
        case "LOGOUT":
            return {
                ...state, email: false, username: false, type: false
            }
        default:
            return state
    }
}

// context Provider
const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialState)

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL+"/userData", { withCredentials: true })
                Auth.authenticate();
                dispatch({
                    type: "LOGIN",
                    payload: response.data
                })
                sessionStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                if (error.response?.status === 403) {
                    try {
                        await axios.get(process.env.REACT_APP_API_URL+"/refreshToken", {withCredentials: true})
                        Auth.authenticate();
                        const res = await axios.get(process.env.REACT_APP_API_URL+"/userData", { withCredentials: true })
                        console.log("login with RT");
                        dispatch({
                            type: "LOGIN",
                            payload: res.data
                        })
                        sessionStorage.setItem("user", JSON.stringify(res.data))
                    } catch (err) {
                        console.log("logout")
                        Auth.signOut()
                        dispatch({
                            type: "LOGOUT",
                        })
                        sessionStorage.removeItem("user")
                        // window.location.replace("/logout")
                    }
                } else {
                    Auth.signOut()
                    console.log("logout")
                    dispatch({
                        type: "LOGOUT",
                    })
                    sessionStorage.removeItem("user")
                    // window.location.replace("/logout")
                }
            }
        }
        getData()
    }, []);

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    )
}

export { Context, Provider }