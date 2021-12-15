import { useState, useContext, useEffect, } from "react"
import { Context } from '../context';
import { Card } from "react-bootstrap";
import axios from "axios";


const Conversation = ({ conversation, index, setMessageByConversation, clicked, active }) => {

  const styleObj = {
    width: '29rem',
    cursor: "pointer",

  }

  const { state } = useContext(Context)
  const [friendData, setFriendData] = useState({})
  const [activeStatus, setActiveStatus] = useState(false)
  const [sendConversation, setSendConversation] = useState({})



  useEffect(() => {
    const friendCollId = {
      friendCollectionId: conversation.friendCollectionId
    }
    const getUser = async () => {
      const res = await axios.post(process.env.REACT_APP_API_URL + "/friendId", friendCollId, { withCredentials: true })
      const friendEmail = await res.data.members.find((e) => e !== state.email)
      setActiveStatus(active.some(u => u.userEmail === friendEmail))
      const response = await axios.post(process.env.REACT_APP_API_URL +"/emailData", { email: friendEmail }, { withCredentials: true })
      setFriendData(response.data)
    }
    getUser()
  }, [conversation, state, active])
  useEffect(() => {
    setSendConversation({
      "_id": conversation._id,
      "friendCollectionId": conversation.friendCollectionId,
      "newMessage": conversation.newMessage,
      "lastMessage": conversation.lastMessage,
      "active": activeStatus
    })
  }, [conversation, activeStatus])

  return (
    <div>
      <Card
        bg={clicked._id === conversation._id ? "primary" : "light"}
        key={index}
        text={clicked._id === conversation._id ? "light" : "dark"}
        style={styleObj}
        className="mb-4"
        onClick={(e) => { setMessageByConversation(sendConversation) }}
      >
        <Card.Body>
          <Card.Title>{friendData.name}<small style={{ color: clicked._id === conversation._id ? "white" : "green", marginLeft: "30%" }}>
            {activeStatus ? "Active Now" : ""}</small>
            <div style={{ color: clicked._id === conversation._id ? "white" : "blue", marginLeft: "40%" }}>
              {conversation.newMessage && conversation.senderEmail !== state.email && <ion-icon name="radio-button-off"></ion-icon>}
            </div>
          </Card.Title>
          <Card.Text>{friendData.email}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}


export default Conversation