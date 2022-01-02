import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from "../../context/socket";
import "./TopBar.css"


const TopBar = ({ friendData, activeUsers, messageConversation }) => {
  const [print, setPrint] = useState("Active")
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    socket.socket?.current.on("typing", ({ messageConversationId }) => {
      if (messageConversation?._id === messageConversationId) {
        setPrint("Typing")
        setTimeout(setPrint, 3000, "Active")
      }
    })
  }, [socket, messageConversation])

  return (
    <div className="p-2 topBar">
      <div className="align-items-center row m-0">
        <div className="col-8 col-sm-4">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0 d-block d me-2">
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <div className="d-flex align-items-center">
                <div className="avatar-sm align-self-center">
                  <span className="avatar-title rounded-circle bg-warning">{friendData.name?.slice(0, 1)}
                  </span>
                </div>
                <div className="">
                  <h5 class="pt-2 mb-0">{friendData.name}</h5>
                  <p className="m-0">{friendData.email}</p>
                  <p className="text-truncate text-muted m-0"><small style={{ color: "green" }}>{activeUsers.some(u => u.userEmail === friendData.email) ? print : ""}</small></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar