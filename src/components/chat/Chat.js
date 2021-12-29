import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Auth from '../../isAuth'
import { Context } from '../../context';
import Conversation from '../conversation/Conversation'
import { SocketContext } from "../../context/socket";
import SearchBar from '../SearchBar/SearchBar';

const Chat = ({ messageConversation, MessageConversation, activeUsers }) => {

  const { state } = useContext(Context)
  const [input, setInput] = useState("")
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })
  const { socket } = useContext(SocketContext)
  const [conversations, setConversations] = useState([])


  const getUser = async () => {
    console.log("get Users")
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/allConversations", { withCredentials: true })
      setConversations(response.data)
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("receive 403 from token user");
        try {
          await axios.get(process.env.REACT_APP_API_URL + "/refreshToken", { withCredentials: true })
          const res = await axios.get(process.env.REACT_APP_API_URL + "/allConversations", { withCredentials: true })
          setConversations(res.data)
          console.log("login with RT user");
        } catch (error) {
          Auth.signOut()
          // window.location.replace("/logout")
        }
      } else {
        Auth.signOut()
        // window.location.replace("/logout")
      }
    }
  }
  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    getUser()
  }, [messageConversation.newMessage])

  useEffect(() => {
    socket?.socket?.current.on("getMessage", (data) => {
      console.log("message Received")
      if (messageConversation?._id !== data.conversationId) {
        getUser()
      }
    })
    return () => {
      socket.socket.current.off("getMessage");
    };
  }, [socket.socket, messageConversation])
  useEffect(() => {
    const sendDelivered = async (c) => {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/deliveredByConversationId",
        { id: c._id }, { withCredentials: true })
      if (response.data.n !== 0) {
        socket?.socket?.current.emit("messageDelivered", {
          all: true,
          conversationId: c._id,
          senderEmail: c.senderEmail
        })
      }
    }
    conversations.forEach(i => {
      if (i.newMessage === true) {
        if (i.senderEmail !== state.email) {
          if (i._id !== messageConversation?._id) {
            sendDelivered(i)
          }
        }
      }
    })
  }, [conversations, messageConversation, state, socket])

  return (
    <div>
      <SearchBar print="Conversations" setInput={setInput} input={input} />
      <div className="pt-2">
        <h3 className="px-4 pb-2">Recent</h3>
        <ul className="list-unstyled m-0 chat-user-list">
          {(conversations?.map((item, i) => {
            if (item.email === state.email) {
              return null
            }
            return <Conversation conversation={item} key={i} index={i} setMessageByConversation={MessageConversation} messageConversation={messageConversation} active={activeUsers} search={input} />
          }))}
        </ul>
      </div>
    </div >
  )
}

export default Chat