import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Dropdown } from "react-bootstrap";
import { SocketContext } from "../../context/socket";
import { Context } from '../../context';
import "./TopBar.css"


const TopBar = ({ messageFriend, AllClose, notFriend, MessageFriend, friendData, activeUsers, messageConversation }) => {

  const { state } = useContext(Context)
  const [print, setPrint] = useState("Active")
  const { socket } = useContext(SocketContext)
  // const [isDesktop, setDesktop] = useState(window.innerWidth > 1450);

  // const updateMedia = () => {
  //   setDesktop(window.innerWidth < 576);
  // };

  // useEffect(() => {
  //   window.addEventListener("resize", updateMedia);
  //   return () => window.removeEventListener("resize", updateMedia);
  // });


  useEffect(() => {
    socket.socket?.current.on("typing", ({ messageConversationId }) => {
      if (messageConversation?._id === messageConversationId) {
        setPrint("Typing")
        setTimeout(setPrint, 3000, "Active")
      }
    })
  }, [socket, messageConversation])

  const Unfriend = async () => {
    const response = await axios.get(process.env.REACT_APP_API_URL + "/unfriend?friendEmail=" + friendData.email
      , { withCredentials: true })
    MessageFriend(friendData, messageConversation)
    let email = friendData.email
    let myEmail = state.email
    socket.socket?.current.emit("checkFriend", { email, myEmail })
  }

  return (
    // <div className="">
    <div className="row topBar p-2 m-0">
      {/* <div className="col-8 col-sm-4"> */}
      {/* <div className="d-flex align-items-center"> */}
      {/* <div className="flex-shrink-0 d-block d me-2"> */}
      {/* </div> */}
      <div className="">
        <div className="d-flex position-relative" style={{}}>
          <div style={{cursor: "pointer"}} className={'pt-2 mx-2 ' + ((notFriend || messageConversation || messageFriend) ? "showArrow" : "hideArrow")}>
            <ion-icon name="arrow-back" size="large" onClick={AllClose}></ion-icon>
          </div>
          <div className="avatar-sm align-self-center" style={{}}>
            <span className="avatar-title rounded-circle bg-warning">{friendData.name?.slice(0, 1)}
            </span>
          </div>
          <div className="" style={{}}>
            <h5 class="pt-2 mb-0">{friendData.name}</h5>
            <p className="m-0">{friendData.email}</p>
            <p className="text-truncate text-muted m-0"><small style={{ color: "green" }}>{activeUsers.some(u => u.userEmail === friendData.email) ? print : ""}</small></p>
          </div>
        </div>
        <div className='pt-2 mr-2' style={{ top: "6%", right: "4%", position: "absolute" }}>
          {!notFriend && <Dropdown>
            <Dropdown.Toggle style={{ all: "unset", cursor: "pointer" }}>
              <ion-icon style={{ color: "#797c8c" }} size="large" name="more"></ion-icon>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={Unfriend}>Unfriend</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>}
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
    </div>
    // </div>
  )
}

export default TopBar