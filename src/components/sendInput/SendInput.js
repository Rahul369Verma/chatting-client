import React, { useContext, useRef, useState } from 'react'
import { SocketContext } from "../../context/socket";
import { Context } from '../../context';
import axios from "axios";
import Picker from 'emoji-picker-react';
import "./SendInput.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';




const SendInput = ({ MessageConversation, messageConversation, friendData, messageFriend, setMessageData }) => {

  const { socket } = useContext(SocketContext)
  const [inputData, setInputData] = useState("")
  const { state } = useContext(Context)
  const inputRef = useRef(null)
  const [toggle, setToggle] = useState(false);
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })



  const sendMessage = async (e) => {
    e.preventDefault()
    const messageForm = {
      conversationId: messageConversation._id,
      friendId: messageFriend._id,
      senderEmail: state.email,
      message: inputData
    }
    console.log(messageForm)
    try {
      const response = await axiosInstance.post("messagePost", messageForm, { withCredentials: true })
      setInputData("")
      setMessageData(prev => [...prev, response.data.messageSaved])
      if (messageConversation) {
        console.log("Message send successfully", response.data)
        socket.socket.current.emit("sendMessage", {
          _id: response.data.messageSaved._id,
          conversationId: messageConversation._id,
          senderEmail: state.email,
          text: inputData,
          receiverEmail: friendData.email
        })
      } else {
        console.log("Message send successfully", response.data)
        MessageConversation(response.data.conversationSaved, friendData)
        socket.socket.current.emit("sendMessage", {
          _id: response.data.messageSaved._id,
          conversationId: response.data.conversationSaved._id,
          senderEmail: state.email,
          text: inputData,
          receiverEmail: friendData.email
        })
      }

    } catch (error) {
      if (error.response?.status === 403) {
        await axiosInstance.get("refreshToken", { withCredentials: true })
      }
      console.log(error, error.response?.data)
    }
  }


  const changeInput = (e) => {
    setInputData(e.target.value);
    if (messageConversation) {
      if (friendData) {
        socket.socket.current.emit("typing", { messageConversation: messageConversation, friendData: friendData })
      }
    }
  }
  const onEmojiClick = (event, emojiObject) => {
    const { selectionStart, selectionEnd } = inputRef.current
    // replace selected text with clicked emoji
    const newVal = inputData.slice(0, selectionStart) + emojiObject.emoji + inputData.slice(selectionEnd)
    setInputData(newVal)
  };


  return (
    <div className='outer m-0'>
      {toggle && <Picker native pickerStyle={{ position: "absolute", top: "-51vh" }} onEmojiClick={onEmojiClick} />}
      <hr className="m-0 text-muted" />
      <div className="mb-3 inner-form">
        <form className="d-flex" onSubmit={sendMessage} ref={(el) => { }}>
          <i onClick={() => setToggle(!toggle)} className="bi bi-emoji-smile p-2 form-emoji"></i>
          <input className="form-control form-input" ref={inputRef} value={inputData}
            type="search" placeholder="Search" aria-label="Search" onChange={changeInput} />
          <button className="btn btn-success m-0 form-button" type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default SendInput