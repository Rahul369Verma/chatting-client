import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Auth from '../../isAuth'
import { Context } from '../../context';
import { SocketContext } from "../../context/socket";
import SearchBar from '../SearchBar/SearchBar';
import Other from './Other';

const Others = () => {

  const { state } = useContext(Context)
  const [input, setInput] = useState("")
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })
  const { socket } = useContext(SocketContext)
  const [others, setOthers] = useState(false)
  const [friends, setFriends] = useState([])


  useEffect(() => {
    const getOthers = async() =>{
      const response = await axios.post(process.env.REACT_APP_API_URL + "/otherUsers", {name: input}, { withCredentials: true })
      setOthers(response.data.allUsers)
      setFriends(response.data.friends)
    }
    if(input !== ""){
      getOthers()
    }
    return() => {setOthers(false)}
  }, [input])

  const RemoveNotification = (data) => {
    const newOthers = others.filter((e) => e !== data)
    setOthers(newOthers)
  }

  console.log(others)
  return (
    <div>
      <SearchBar print="Find Others" setInput={setInput} input={input} />
      {(input) && ( others ? (others.length === 0 ? (<h4>No results found</h4>):
      (<div className="pt-2">
        <h3 className="px-4 pb-2">Others</h3>
        <ul className="list-unstyled m-0 chat-user-list">
          {(others?.map((item, i) => {
            if (item.email === state.email) {
              return null
            }
            for (let i = 0; i < friends.length; i++) {
              if(friends[i].allFriends.email === item.email){
                return null
              }              
            }
            return <Other other={item} key={i} index={i} RemoveNotification={RemoveNotification} />
          }))}
        </ul>
      </div>)
      ): <div>Loading</div>
      )}
    </div >
  )
}

export default Others
// || friends.includes(item)