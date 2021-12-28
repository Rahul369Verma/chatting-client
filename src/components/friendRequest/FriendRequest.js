import { useState, useContext, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import { Context } from '../../context';
import { SocketContext } from "../../context/socket";





const FriendRequest = ({ notification, index }) => {

  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)
  const [user, setUser] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/emailData",
        { email: notification?.senderEmail }, { withCredentials: true })
      setUser(response.data)
    }
    getUser()
  }, [notification])

  return (
    <div>
      {user && <li key={index}>
        <div className="px-4 chat-list-conversation d-flex" style={{ cursor: "default" }}>
          <div className="d-flex align-items-center pb-1">
            <div className="chat-user-img align-self-center me-2">
              <div className="avatar-conversation align-self-center">
                <span className="avatar-title rounded-circle bg-secondary">{user.name.slice(0, 1)}
                </span>
              </div>
            </div>
            <div className="overflow-hidden">
              <h6 className="text-truncate mb-0">{user.name}</h6>
              <h6 className="text-truncate mb-0 overflow-visible">{user.email}</h6>
            </div>
          </div>
        </div>
        <div style={{}} className="d-flex">
          <div className="mx-auto">
            <Button className="my-auto mx-auto">Accept</Button>
          </div>
          <div className="mx-auto">
            <Button className="my-auto mx-auto">Reject</Button>
          </div>
        </div>
      </li>}
    </div >
  )
}


export default FriendRequest
