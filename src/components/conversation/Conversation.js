import { useState, useContext, useEffect, } from "react"
import { Context } from '../../context';
import { Card } from "react-bootstrap";
import { SocketContext } from "../../context/socket";
import "./Conversation.css"
import axios from "axios";


const Conversation = ({ conversation, index, setMessageByConversation, messageConversation, active, search }) => {

  const styleObj = {
    display: "block",
    cursor: "pointer",
    position: "relative"
  }

  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)
  const [print, setPrint] = useState("Active Now")
  const [friendData, setFriendData] = useState(false)
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
    if (search === "") {
      getUser()
    }
    return () => {}
  }, [conversation.friendCollectionId, state, search])

  useEffect(() => {
    if (active.some(u => u.userEmail === friendData.email)) {
      setActiveStatus(true)
    } else {
      setActiveStatus(false)
    }
  }, [active, friendData])

  useEffect(() => {
    if (search !== "" && friendData) {
      let name = friendData.name.toLowerCase()
      let find = search.toLowerCase()
      if (name.includes(find)) {
      } else {
        setFriendData(false)
      }
    }
  }, [search, friendData])


  return (
    <div>
      {friendData ? <li key={index} onClick={(e) => { setMessageByConversation(conversation, friendData) }}>
        <div className={"px-4 chat-list-conversation " + (messageConversation._id === conversation._id ? "active" : "")} href="/dashboard">
          <div className="d-flex align-items-center">
            <div className="chat-user-img align-self-center me-2">
              <div className="avatar-conversation align-self-center">
                <span className="avatar-title rounded-circle bg-secondary">{friendData.name?.slice(0, 1)}
                  {activeStatus ? <span className="span-conversation"></span> : ""}
                </span>

              </div>
            </div>
            <div className="overflow-hidden">
              <h6 className="text-truncate mb-0">{friendData.name}</h6>
            </div>
            <div className="ms-auto">
              {conversation.newMessage && (conversation.senderEmail !== state.email) && <span className="badge badge-soft-dark rounded p-1"><ion-icon name="radio-button-on"></ion-icon></span>}
            </div>
          </div>
        </div>
      </li> : <div></div>}
      {/* <Card
        bg={clicked._id === conversation._id ? "primary" : "light"}
        key={index}
        text={clicked._id === conversation._id ? "light" : "dark"}
        style={styleObj}
        className="mb-4"
        onClick={(e) => { setMessageByConversation(conversation, friendData) }}
      >
        <Card.Body>
          <Card.Title>{friendData.name}
            <div style={{ color: clicked._id === conversation._id ? "white" : "blue", marginLeft: "40%" }}>
              {conversation.newMessage && conversation.senderEmail !== state.email && <ion-icon name="radio-button-off"></ion-icon>}
            </div>
          </Card.Title>
          <Card.Text>{friendData.email}</Card.Text>
        </Card.Body>
      </Card> */}
    </div>
  )
}


export default Conversation