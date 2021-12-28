import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Card, Button } from "react-bootstrap";
import { Context } from '../context';
import { SocketContext } from '../context/socket';



const Notification = ({ RemoveNotification, data, index }) => {
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })
  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)
  const [user, setUser] = useState("")



  const styleObj = {
    width: '29rem',
  }



  const acceptRequest = async () => {
    const response = await axiosInstance.post("acceptFriendRequest",
      { data: data }, { withCredentials: true })
    console.log(response.data)
    let email = data.senderEmail
    socket.socket?.current.emit("notification", { email })
    RemoveNotification(data)
  }
  const removeRequest = async () => {
    const response = await axiosInstance.post("removeFriendRequest",
      { data: data }, { withCredentials: true })
    console.log("notification removed", response.data)
    console.log(socket)
    if (socket !== null) {
      let email = data.senderEmail
      socket.socket?.current.emit("notification", { email })
    }
    RemoveNotification(data)
  }
  const deleteNotification = async () => {
    await axiosInstance.post("removeNotification",
      { data: data }, { withCredentials: true })
    RemoveNotification(data)
  }

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/emailData", { email: data.senderEmail },
        { withCredentials: true })
      setUser(response.data)
    }
    if (data.type === "friendRequest") {
      getUser()
    }
    return () => { setUser(null) }
  }, [data])

  return (
    <div>
      {
        (data.type === "friendRequest") ?
          (<Card
            key={index}
            text="Light"
            style={styleObj}
            className="mb-4"
          >
            <Card.Body>
              <Card.Title>Friend Request received from {user?.name}({user?.email})
                <ion-icon style={{ cursor: "pointer", marginLeft: "40%" }} onClick={deleteNotification} name="trash"></ion-icon>
              </Card.Title>
              <Button onClick={() => { acceptRequest(data) }}>Accept</Button>
              <Button onClick={() => { removeRequest(data) }}>Remove</Button>
            </Card.Body>
          </Card>) :
          (data.type === "acceptFriendRequest") ?
            (<Card
              key={index}
              text="Light"
              style={styleObj}
              className="mb-4"
            >
              <Card.Body>
                <Card.Title>Accepted Friend Request
                  <ion-icon style={{ cursor: "pointer", marginLeft: "40%" }} onClick={deleteNotification} name="trash"></ion-icon>
                </Card.Title>
                <Card.Text>{data.senderEmail} accepted your friend Request.</Card.Text>
              </Card.Body>
            </Card>) :
            (data.type === "removeFriendRequest") ?
              (<Card
                key={index}
                text="Light"
                style={styleObj}
                className="mb-4"
              >
                <Card.Body>
                  <Card.Title>Rejected Friend Request
                    <ion-icon style={{ cursor: "pointer", marginLeft: "40%" }} onClick={deleteNotification} name="trash"></ion-icon>
                  </Card.Title>
                  <Card.Text>{data.senderEmail} rejected your friend Request.</Card.Text>
                </Card.Body>
              </Card>) : <div>different Notification</div>
      }
    </div>
  )
}

export default Notification