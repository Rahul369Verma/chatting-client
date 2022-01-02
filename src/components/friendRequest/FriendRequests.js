import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Auth from '../../isAuth'
import { Context } from '../../context';
import { SocketContext } from "../../context/socket";
import FriendRequest from './FriendRequest';

const FriendRequests = () => {

  const { state } = useContext(Context)
  const [input, setInput] = useState("")
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })
  const { socket } = useContext(SocketContext)
  const [notifications, setNotifications] = useState("")


  useEffect(() => {
    const getAllNotifications = async () => {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/allRequests", { withCredentials: true })
      setNotifications(response.data)
    }
    getAllNotifications()
    return () => { setNotifications("") }
  }, [])
  console.log(notifications)

  const RemoveNotification = (data) => {
    const newNotifications = notifications.filter((e) => e !== data)
    setNotifications(newNotifications)
  }

  return (
    <div>
      {notifications === "" ? <div>Loading</div> :
        (notifications.length === 0 ? <h4>No Friend Requests Found</h4> : (<div className="pt-2">
          <h3 className="px-4 pb-2">FriendRequests</h3>
          <ul className="list-unstyled m-0 chat-user-list">
            {(notifications?.map((item, i) => {
              return <FriendRequest notification={item} key={i} index={i} RemoveNotification={RemoveNotification} />
            }))
            }
          </ul>
        </div>
        ))
      }
    </div >
  )
}

export default FriendRequests