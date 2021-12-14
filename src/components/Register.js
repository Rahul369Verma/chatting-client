import React, { useState, useContext } from "react"
import axios from "axios"
import { Context } from '../context';
import { useHistory } from 'react-router-dom';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css"
import Auth from "../isAuth";


const Register = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errMess, setErrMess] = useState("")
	const axiosInstance = axios.create({baseURL: process.env.REACT_APP_API_URL})



  const { state } = useContext(Context);
  const { dispatch } = useContext(Context);


  const history = useHistory()

  const getName = (e) => {
    setName(e.target.value)
  }
  const getEmail = (e) => {
    setEmail(e.target.value)
  }
  const getPassword = (e) => {
    setPassword(e.target.value)
  }
  const formSubmit = async (e) => {
    e.preventDefault();
    const registerData = {
      name,
      email,
      password,
      type: "normal"
    }
    try {
      const response = await axiosInstance.post('register', registerData,{
        withCredentials: true
      })
      console.log(response.data);
      await Auth.authenticate()
      await window.sessionStorage.setItem("user", JSON.stringify(response.data))
      await dispatch({
        type: "LOGIN",
        payload: response.data
      })
      window.location.replace("/chatting")
      // history.push("/chatting")
    } catch (error) {
      console.log(error.response?.data);
      setErrMess(error.response?.data)
    }
  }
  if (Auth.getAuth()) {
    history.push("/chatting")
  }


  return (
    <div className="outer">
      <form className="inner" onSubmit={formSubmit}>
        <h3>Register</h3>
        <p style={{ marginRight: '30px' }}>{errMess}</p>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={getName}
            className="form-control" placeholder="First name" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={getEmail}
            className="form-control" placeholder="Enter email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={getPassword}
            className="form-control" placeholder="Enter password" />
        </div>

        <button type="submit" className="btn btn-dark btn-lg btn-block">Register</button>
        <p className="forgot-password text-right">
          Already registered <a href="/login">log in?</a>
        </p>
      </form>
    </div>
  )
}

export default Register
