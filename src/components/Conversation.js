import { useState, useContext, useEffect, } from "react"
import { Context } from '../context';
import { Card } from "react-bootstrap";
import { SocketContext } from "../context/socket";
import axios from "axios";


const Conversation = ({ conversation, index, setMessageByConversation, clicked, active }) => {

  const styleObj = {
    width: '29rem',
    cursor: "pointer",

  }

  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)
  const [print, setPrint] = useState("Active Now")
  const [friendData, setFriendData] = useState({})
  const [activeStatus, setActiveStatus] = useState(false)



  useEffect(() => {
    const friendCollId = {
      friendCollectionId: conversation.friendCollectionId
    }
    const getUser = async () => {
      const res = await axios.post(process.env.REACT_APP_API_URL + "/friendId", friendCollId, { withCredentials: true })
      const friendEmail = await res.data.members.find((e) => e !== state.email)
      const response = await axios.post(process.env.REACT_APP_API_URL + "/emailData", { email: friendEmail }, { withCredentials: true })
      setFriendData(response.data)
    }
    getUser()
    return () => { setFriendData({}); setActiveStatus(false) }
  }, [conversation, state])

  useEffect(() => {
    if(active.some(u => u.userEmail === friendData.email)){
      setActiveStatus(true)
    }else{
      setActiveStatus(false)
    }
  }, [active, friendData])

  useEffect(() => {
    socket.socket?.current.on("typing", ({messageConversation}) => {
      if (conversation._id === messageConversation._id) {
        setPrint("Typing")
        setTimeout(setPrint, 3000, "Active Now")
      }
    })
  }, [socket, conversation])

  return (
    <Card
      bg={clicked._id === conversation._id ? "primary" : "light"}
      key={index}
      text={clicked._id === conversation._id ? "light" : "dark"}
      style={styleObj}
      className="mb-4"
      onClick={(e) => { setMessageByConversation(conversation, friendData) }}
    >
      <Card.Body>
        <Card.Title>{friendData.name}<small style={{ color: clicked._id === conversation._id ? "white" : "green", marginLeft: "30%" }}>
          {activeStatus ? print : ""}</small>
          <div style={{ color: clicked._id === conversation._id ? "white" : "blue", marginLeft: "40%" }}>
            {conversation.newMessage && conversation.senderEmail !== state.email && <ion-icon name="radio-button-off"></ion-icon>}
          </div>
        </Card.Title>
        <Card.Text>{friendData.email}</Card.Text>
      </Card.Body>
    </Card>
  )
}


export default Conversation