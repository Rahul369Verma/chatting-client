import { useContext, useState, useEffect } from "react"
import { Context } from '../context';
import { SearchContext } from '../context/searchItem';
import RegisterAdmin from './RegisterAdmin'
import { useLocation } from 'react-router-dom';
import { Nav, NavDropdown, Navbar, Container } from 'react-bootstrap';
import axios from "axios";
import NotificationModal from "./NotificationModal";
import { SocketContext } from "../context/socket";


const Navigator = () => {
  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)
  const { searchDispatch } = useContext(SearchContext)
  const [notificationReceived, setNotificationReceived] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [toggleNotification, setToggleNotification] = useState(false)
  const [searchData, setSearchData] = useState("")
  const location = useLocation();
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })


  const changeInput = async (e) => {
    setSearchData(e.target.value)
    if (e.target.value === "") {
      searchDispatch({
        type: "Empty",
      })
    } else {
      try {// we send our email because jwtData not contain email
        const response = await axiosInstance.post("searchUsers", { name: e.target.value, email: state.email }, { withCredentials: true })
        searchDispatch({
          type: "Change",
          payload: response.data
        })
      } catch (err) {
        console.log(err)
      }
    }

  }



  const toggleModal = () => {
    setToggle(!toggle);
  }

  const toggleNotificationModal = async () => {
    if (toggleNotification) {
      setToggleNotification(!toggleNotification);
      setNotificationReceived(false)
      await axiosInstance.get("seenNotifications", { withCredentials: true })
    } else {
      setToggleNotification(!toggleNotification);
    }
  }

  useEffect(() => {
    socket.socket?.current.on("notification", () => {
      console.log("running")
      setNotificationReceived(true)
    })
  }, [socket])

  return (
    <Navbar style={{ zIndex: "2", position: "sticky", height: "65px" }} bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="https://www.logolynx.com/images/logolynx/21/214fba9d9e8566bf92d15c66bf919d16.png"
            width="30"
            height="30"
            style={{ "marginRight": "10px" }}
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
          Rahul Verma
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {(state.type === "admin") ? (
              <>
                <Nav.Link
                  onClick={toggleModal} >
                  Register Admin
                </Nav.Link>
              </>

            ) : (
              (state.type === "normal") ? (
                <></>
              ) : (
                <>
                  <Nav.Link href="/register">Register</Nav.Link>
                  <Nav.Link href="/login">Login</Nav.Link>
                </>
              )
            )}
            <RegisterAdmin isOpen={toggle} toggleModal={toggleModal} />
            <NotificationModal setNotificationReceived={setNotificationReceived} isOpen={toggleNotification} toggleModal={toggleNotificationModal} />
            <Nav.Link href="/chatting">Chatting</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">

              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>

          </Nav>

          {(state.email || state.username) && (
            <>
              <Nav.Link
                onClick={toggleNotificationModal} >
                {notificationReceived ? <ion-icon size="large" style={{ color: "red" }} name="notifications"></ion-icon> :
                  <ion-icon size="large" style={{ color: "pink" }} name="notifications"></ion-icon>}
              </Nav.Link>
              {(location.pathname === "/chatting") && <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                <input style={{ height: "34px" }} className="form-control me-2 mt-2" value={searchData}
                  type="search" placeholder="Search" aria-label="Search" onChange={changeInput} />
                {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
              </form>}

              <Nav>
                <li style={{ float: "left", paddingRight: "5px" }}>
                  <Nav.Link href="/logout">Logout</Nav.Link>
                </li>
                <Nav.Link className="">
                  <li className="text-center" >
                    <span className="p-2 avatar avatar-32 rounded bg-danger">{state.username}
                    </span>
                  </li>
                </Nav.Link>
              </Nav>
            </>
          )}

        </Navbar.Collapse>
      </Container >
    </Navbar >
  )
}

export default Navigator
