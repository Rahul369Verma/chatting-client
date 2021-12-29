import {useContext} from "react"
import Auth from '../isAuth';
import { Context } from '../context';
import Loader from "./loader/loader";



const Home = () => {

	const { state } = useContext(Context)


  if (Auth.getAuth() || state.email === false) {
    return (
      <div className="whole">
        <h1>Thanks for checkout</h1>
        <br />
        <h3>Do Register or login to see Chatting App</h3>
      </div>
    )
  } else if (state.email === null) {
    return (
      <div>
        <Loader />
      </div>
    )
  }
}

export default Home