import axios from 'axios'
import { useContext, useEffect } from "react"
import { Context } from '../context';
import { Card } from "react-bootstrap";
import { format } from "timeago.js";
import { SocketContext } from "../context/socket";



const Messages = ({ message, index, messageConversation }) => {


  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)



  const senderStyle = {
    position: "relative",
    display: "flex",
    listStyle: "none",
    marginRight: "20px",
    justifyContent: "flex-end",
  }
  const receiverStyle = {
    position: "relative",
    display: "flex",
    listStyle: "none",
    justifyContent: "flex-start",
  }

  const senderInner = {
    position: "relative",
    display: "flex",
    justifyContent: "end",
    maxWidth: "400px"

  }
  const receiverInner = {
    position: "relative",
    display: "flex",
    justifyContent: "start",
    maxWidth: "400px"
  }

  const showTicks = () => {
    console.log("status",message.status)
    if (message.status === "seen") {
      return <ion-icon style={{ color: "red" }} name="done-all"></ion-icon>
    } else if (message.status === "delivered") {
      return <ion-icon name="done-all"></ion-icon>
    } else {
      return <ion-icon name="checkmark"></ion-icon>
    }
  }

  useEffect(() => {
    const sendSeen = async (m) => {
      await axios.post(process.env.REACT_APP_API_URL + "/seen",
        { id: m._id }, { withCredentials: true })
      socket?.socket?.current.emit("messageSeen", {
        _id: m._id,
        senderEmail: m.senderEmail
      })
    }
    const falseNewMessage = async (id) => {
      await axios.post(process.env.REACT_APP_API_URL + "/allSeen",
        { id: id }, { withCredentials: true })
    }
    if (message.senderEmail !== state.email) {
      if (message.status !== "seen") {
        if (message.message === messageConversation.lastMessage) {
          falseNewMessage(messageConversation._id)
          sendSeen(message)
        } else {
          sendSeen(message)
        }
      }
    }
  }, [message, messageConversation, socket, state])


  return (
    // <div>
    //   <li
    //     style={message.senderEmail === state.email ? senderStyle : receiverStyle}

    //   >{message.message}</li>
    // </div>
    <li style={message.senderEmail === state.email ? senderStyle : receiverStyle}>
      <div style={{ position: "relative" }}>
        <div style={message.senderEmail === state.email ? senderInner : receiverInner}>
          <Card
            // bg={message.senderEmail === state.email ? "" : "light"}
            key={index}
            text={message.senderEmail === state.email ? "dark" : "dark"}
            style={message.senderEmail === state.email ? { backgroundColor: "rgba(78,172,109,.23)" } : { backgroundColor: "white", boxShadow: "0 2px 4px rgb(15 34 58 / 12%)" }}
            className="mt-4"
          >
            <Card.Body>
              <Card.Text>{message.message}</Card.Text>
            </Card.Body>
          </Card>
        </ div>
        <div style={message.senderEmail === state.email ? senderInner : receiverInner}>
          <small
            className="text-muted">
            {format(message.createdAt)}
          </small>
          {message.senderEmail === state.email && showTicks()}
        </div>
      </div>
    </li>
  )
}


export default Messages