import { useContext } from "react"
import { Context } from '../context';
import axios from "axios";
import Auth from '../isAuth';

const Logout = async () => {

    const { dispatch } = useContext(Context)
	const axiosInstance = axios.create({baseURL: process.env.REACT_APP_API_URL})
    
    try {
        const response = await axiosInstance.get('logout', {
            withCredentials: true
        })
        console.log("response", response)
        await dispatch({
            type: "LOGOUT",
        })
        await Auth.signOut()
        await sessionStorage.removeItem("user")
        await sessionStorage.removeItem("messageConversation")
        await sessionStorage.removeItem("messageFriend")
        window.location.replace("/login")
        // history.push("/login")
    } catch (err) {
        console.log("error", err)
    }
    return null

}

export default Logout