import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Auth from '../../isAuth'
import { Context } from '../../context';
import { SocketContext } from "../../context/socket";
import SearchBar from '../SearchBar/SearchBar';
import Friend from './Friend';

const Friends = ({ MessageFriend }) => {

  const { state } = useContext(Context)
  const [input, setInput] = useState("")
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })
  const { socket } = useContext(SocketContext)
  const [friends, setFriends] = useState([])


  const getUser = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/allFriends", { withCredentials: true })
      setFriends(response.data)
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("receive 403 from token user");
        try {
          await axios.get(process.env.REACT_APP_API_URL + "/refreshToken", { withCredentials: true })
          const res = await axios.get(process.env.REACT_APP_API_URL + "/allFriends", { withCredentials: true })
          setFriends(res.data)
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
    if (input === "") {
      getUser()
    }
  }, [input])

  useEffect(() => {
    const getSearchFriends = async () => {
      const response = await axios.get(process.env.REACT_APP_API_URL +
        "/search/Friends?search=" + input, { withCredentials: true })
      setFriends(response.data)
    }
    if (input !== "") {
      getSearchFriends()
    }
  }, [input])


  return (
    <div>
      <SearchBar print="Find Friends" setInput={setInput} input={input} />
      <div className="pt-2">
        <h3 className="px-4 pb-2">Friends</h3>
        <ul className="list-unstyled m-0 chat-user-list">
          {(friends?.map((item, i) => {
            if (item.email === state.email) {
              return null
            }
            return <Friend friend={item} key={i} index={i} setMessageByFriend={MessageFriend} />
          }))}
        </ul>
      </div>
    </div >
  )
}

export default Friends