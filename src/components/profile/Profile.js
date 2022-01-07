import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Auth from '../../isAuth'
import { Context } from '../../context';
import Conversation from '../conversation/Conversation'
import { SocketContext } from "../../context/socket";
import SearchBar from '../SearchBar/SearchBar';

const Profile = ({ getMessage, setGetMessage, messageConversation, MessageFriend, activeUsers }) => {

  const { state } = useContext(Context)
  const [input, setInput] = useState("")
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })
  const { socket } = useContext(SocketContext)



  return (
    <div style={{}}>
      <div className="pt-2">
        <h3 className="px-4 pb-2" style={{ textAlign: "center" }}>Profile</h3>
        <div className="avatar-lg align-self-center" style={{
          display: "grid",
          justifyItems: "center", height: '20vh', width: "100%", backgroundColor: "black"
        }}>
          <div className='mv-auto' style={{ alignSelf: "center" }}>
            <h1 style={{ color: "white" }}>{state.username?.slice(0, 1)}</h1>
          </div>
        </div>
        <div style={{textAlign: "center"}}>
          <h2>{state.username}</h2>
          <h6>{state.email}</h6>
        </div>
      </div>
    </div >
  )
}

export default Profile