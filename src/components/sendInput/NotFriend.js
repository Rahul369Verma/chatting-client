import React, { useContext, useEffect, useRef, useState } from 'react'
import { SocketContext } from "../../context/socket";
import { Context } from '../../context';
import axios from "axios";
import "./SendInput.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';




const NotFriends = ({ friendData, MessageFriend, messageConversation }) => {

  const { socket } = useContext(SocketContext)
  const [checkRequest, setCheckRequest] = useState(false)
  const [requestReceived, setRequestReceived] = useState(false)
  const { state } = useContext(Context)
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })

  const acceptRequest = async () => {
    const response = await axiosInstance.post("acceptFriendRequest",
      { data: requestReceived }, { withCredentials: true })
    console.log(response.data)
    let email = friendData.email
    let myEmail = state.email
    socket.socket?.current.emit("checkFriend", { email, myEmail })
    MessageFriend(friendData)
  }
  const removeRequest = async () => {
    const response = await axiosInstance.post("removeFriendRequest",
      { data: requestReceived }, { withCredentials: true })
    console.log("notification removed", response.data)
    console.log(socket)
    let email = friendData.email
    socket.socket?.current.emit("notification", { email})
    setRequestReceived(false)
  }

  const sendRequest = async () => {
    console.log(friendData)
    try {
      setCheckRequest(true)
      await axiosInstance.post("sendFriendRequest",
        { senderEmail: state.email, receiverEmail: friendData.email }, { withCredentials: true })
      let email = friendData.email
      socket.socket?.current.emit("notification", { email })
    } catch (error) {
      setCheckRequest(false)
      console.log(error)
    }
  }
  const cancelRequest = async () => {
    const response = await axiosInstance.post("cancelFriendRequest",
      { senderEmail: state.email, receiverEmail: friendData.email }, { withCredentials: true })
    setCheckRequest(false)
    console.log("notification removed", response.data)
  }

  useEffect(() => {
    const checkRequest = async () => {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/checkFriendRequest",
        { firstEmail: state.email, secondEmail: friendData?.email, type: "friendRequest" }, { withCredentials: true })
      if (response.data.senderEmail === state.email) {
        setCheckRequest(true)
        setRequestReceived(false)
      } else if (response.data.senderEmail === friendData?.email) {
        console.log(response.data)
        setCheckRequest(false)
        setRequestReceived(response.data)
      } else {
        setCheckRequest(false)
        setRequestReceived(false)
      }
    }
    checkRequest()
    return () => { setCheckRequest(false) }
  }, [friendData, state])

  useEffect(() => {
    const checkRequest = async () => {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/checkFriendRequest",
        { firstEmail: state.email, secondEmail: friendData?.email, type: "friendRequest" }, { withCredentials: true })
      if (response.data.senderEmail === state.email) {
        setCheckRequest(true)
        setRequestReceived(false)
      } else if (response.data.senderEmail === friendData?.email) {
        console.log(response.data)
        setCheckRequest(false)
        setRequestReceived(response.data)
      } else {
        setCheckRequest(false)
        setRequestReceived(false)
      }
    }
    socket.socket?.current.on("notification", () => {
      console.log("running")
      checkRequest()
    })
    return () => { setCheckRequest(false) }
  }, [friendData, state, socket])

  useEffect(() => {
    socket.socket?.current.on("checkFriend", ({ myEmail }) => {
      console.log("running")
      if (myEmail === friendData.email) {
        MessageFriend(friendData, messageConversation)
      }
    })
  }, [socket, MessageFriend, friendData, messageConversation])

  return (
    <div className='outer m-0'>
      <div className="mb-3 inner-form align-items-center">
        <hr className="m-0 text-muted" />
        <div className='d-flex' style={{ position: "absolute", left: "10%" }}>
          <div className='m-0 px-4 pt-1' style={{}}>
            <h3>Click Here To Send Friend Request</h3>
          </div>
          <div>
            {!requestReceived && (checkRequest ? <button className='btn btn-success m-0' onClick={cancelRequest}>Cancel</button> :
              <button className='btn btn-success m-0' onClick={sendRequest}>Add Friend</button>)}
            {requestReceived && <div className='d-flex'>
              <button className='btn btn-success m-0' onClick={acceptRequest}>Accept</button>
              <button className='btn btn-success m-0 mx-4' onClick={removeRequest}>Reject</button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFriends