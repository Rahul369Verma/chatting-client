import { useState, useContext, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import { Context } from '../../context';
import { SocketContext } from "../../context/socket";





const FriendRequest = ({ notification, index, RemoveNotification, friendData, MessageFriend, messageConversation }) => {

  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)
  const [user, setUser] = useState(false)
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })


  useEffect(() => {
    const getUser = async () => {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/emailData",
        { email: notification?.senderEmail }, { withCredentials: true })
      setUser(response.data)
    }
    getUser()
  }, [notification])

  const acceptRequest = async () => {
    const response = await axiosInstance.post("acceptFriendRequest",
      { data: notification }, { withCredentials: true })
    console.log(response.data)
    let email = notification.senderEmail
    let myEmail = state.email
    socket.socket?.current.emit("notification", { email })
    socket.socket?.current.emit("checkFriend", { email, myEmail })
    if(email === friendData.email){
      MessageFriend(friendData, messageConversation)
    }
    RemoveNotification(notification)
  }
  const removeRequest = async () => {
    const response = await axiosInstance.post("removeFriendRequest",
      { data: notification }, { withCredentials: true })
    console.log("notification removed", response.data)
    console.log(socket)
    let email = notification.senderEmail
    socket.socket?.current.emit("notification", { email })
    RemoveNotification(notification)
  }

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
            <Button className="my-auto mx-auto btn-sm" onClick={acceptRequest}>Accept</Button>
          </div>
          <div className="mx-auto">
            <Button className="my-auto mx-auto btn-sm" onClick={removeRequest}>Reject</Button>
          </div>
        </div>
      </li>}
    </div >
  )
}


export default FriendRequest
