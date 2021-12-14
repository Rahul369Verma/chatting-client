import React, { useState } from "react"
import axios from "axios"
import './index.css';
import { Modal, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"


const RegisterAdmin = (props) => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errMess, setErrMess] = useState("")
	const axiosInstance = axios.create({baseURL: process.env.REACT_APP_API_URL})


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
      type: "admin"
    }
    try {
      const response = await axiosInstance.post('register', registerData)
      if (response.data.register === true) {
        console.log(response.data.message);
        props.toggleModal()
      } else {
        console.log(response.data.message);
        setErrMess(response.data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Modal show={props.isOpen} onHide={props.toggleModal} animation={false}>
        <form onSubmit={formSubmit}>
          <Modal.Header>
            <Modal.Title>Register New Admin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.toggleModal}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Register New Admin
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}

export default RegisterAdmin