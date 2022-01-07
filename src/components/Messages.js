import axios from 'axios'
import { useContext, useEffect, useState } from "react"
import { Context } from '../context';
import { Card } from "react-bootstrap";
import { format } from "timeago.js";
import { SocketContext } from "../context/socket";




const Messages = ({ setMessageConversation, message, index, messageConversation }) => {


  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)
  const [status, setStatus] = useState("send")



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
    maxWidth: "40vh"

  }
  const receiverInner = {
    position: "relative",
    display: "flex",
    justifyContent: "start",
    maxWidth: "50vh"
  }

  // useEffect(() => {
  //   if(message.status === "seen"){
  //     setStatus("seen")
  //   }else if(message.status === "delivered"){
  //     setStatus("delivered")
  //   }
  // }, [message.status])


  useEffect(() => {
    const sendSeen = async (m) => {
      await axios.post(process.env.REACT_APP_API_URL + "/seen",
        { id: message._id }, { withCredentials: true })
      socket?.socket?.current.emit("messageSeen", {
        conversationId: message.conversationId,
        _id: message._id,
        senderEmail: message.senderEmail
      })
    }
    if (message.senderEmail !== state.email) {
      if (message.status !== "seen") {
        sendSeen()
      }
    }
  }, [message, messageConversation, socket, state])

  useEffect(() => {
    const falseNewMessage = async (id) => {
      await axios.post(process.env.REACT_APP_API_URL + "/allSeen",
        { id: id }, { withCredentials: true })
      setMessageConversation((prev) => ({ ...prev, newMessage: false }))
    }
    if (messageConversation.newMessage) {
      if (message.senderEmail !== state.email) {
        if (message._id === messageConversation.lastMessageId) {
          console.log(messageConversation.lastMessageId)
          falseNewMessage(messageConversation._id)
        }
      }
    }
  }, [message, state, setMessageConversation, messageConversation])

  useEffect(() => {
    setStatus(message.status)
  }, [message.status])

  useEffect(() => {
    socket.socket?.current.on("getMessageSeen", ({ _id, conversationId }) => {
			console.log("message Seen", _id, conversationId)
			if (_id === message._id) {
        setStatus("seen")
				// getMessages()
				// let newArray = messageData
				// for (let i = 0; i < newArray.length; i++) {
				// 	if(newArray[i]._id === _id){
				// 		console.log("seen")
				// 		newArray[i].status = "seen"
				// 	}
				// }
				// setMessageData(newArray)
				// setMessageData((prev) => {
				// 	return prev.map(message => {
				// 		if (message._id === _id) {
				// 			return {
				// 				...message,
				// 				status: "seen",
				// 			}
				// 		}
				// 		return message
				// 	})
				// })
			}
		})
    return () => {
			socket.socket?.current.off("getMessageSeen");
      setStatus("")
		};
  }, [socket, message])


  return (
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
          {message.senderEmail === state.email && (
            <div>
              {(status === "seen") && (<ion-icon style={{ color: "red" }} name="done-all"></ion-icon>)}
              {(status === "delivered") && (<ion-icon name="done-all"></ion-icon>)}
              {(status === "send") && (<ion-icon name="checkmark"></ion-icon>)}
            </div>
          )}
        </div>
      </div>
    </li>
  )
}


export default Messages