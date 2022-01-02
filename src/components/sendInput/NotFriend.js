import React, { useContext, useRef, useState } from 'react'
import { SocketContext } from "../../context/socket";
import { Context } from '../../context';
import axios from "axios";
import "./SendInput.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';




const NotFriends = ({ setMessageConversation , MessageConversation, messageConversationId, friendData, messageFriend, setMessageData }) => {

  const { socket } = useContext(SocketContext)
  const [inputData, setInputData] = useState("")
  const { state } = useContext(Context)
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })
  


  return (
    <div className='outer m-0'>
      <hr className="m-0 text-muted" />
      <div className="mb-3 inner-form">
        <h2>Click Here To Send Friend Request</h2>
        <button>Add Friend</button>
      </div>
    </div>
  )
}

export default NotFriends