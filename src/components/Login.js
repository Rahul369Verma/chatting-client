import { useContext, useState } from "react"
import axios from "axios"
import { Context } from '../context';
import './index.css';
import Auth from '../isAuth';
import "bootstrap/dist/css/bootstrap.min.css"
import { useHistory } from "react-router-dom";


const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errMess, setErrMess] = useState("")
  const history = useHistory()
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })



  const { dispatch } = useContext(Context);



  const getEmail = (e) => {
    setEmail(e.target.value)
  }
  const getPassword = (e) => {
    setPassword(e.target.value)
  }
  const formSubmit = async (e) => {
    e.preventDefault();
    const login = {
      email,
      password,
    }
    try {

      const response = await axiosInstance.post('login', login, {
        withCredentials: true
      })
      // const user = JSON.stringify(response.data)
      await Auth.authenticate()
      await window.sessionStorage.setItem("user", JSON.stringify(response.data))
      await dispatch({
        type: "LOGIN",
        payload: response.data
      })
      window.location.replace("/chatting")
      // history.push("/chatting")
    } catch (error) {
      setErrMess(error.response?.data)
      console.log(error.response);
    }
  }

  if (Auth.getAuth()) {
    history.push("/chatting")
  }

  return (
    <div className="whole">
      <div className="outer-div">
        <form className="inner-div" onSubmit={formSubmit}>

          <h3>Log in</h3>
          <p style={{ marginRight: '30px' }}>{errMess}</p>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={getEmail}
              className="form-control" placeholder="Enter email" autoComplete="on" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={getPassword}
              className="form-control" placeholder="Enter password" autoComplete="on" />
          </div>

          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="customCheck1" />
              <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
            </div>
          </div>

          <button type="submit" className="btn btn-dark btn-lg btn-block">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
