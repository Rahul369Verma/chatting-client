import { useState, useContext, useEffect } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import "./Friend.css"
import { Context } from '../../context';




const Friend = ({ friend, index, setMessageByFriend, clicked, search }) => {

  // const [color, setColor] = useState("light")
  const [user, setUser] = useState(false)
  const { state } = useContext(Context)



  // const styleObj = {
  //   width: '29rem',
  //   cursor: "pointer",
  //   "&:hover": {
  //     background: "blue"
  //   },
  // }

  // const changeBlue = (e) => {
  // setColor("primary")
  // }
  // const changeLight = (e) => {
  // setColor("light")
  // }

  // const setMessage = async (e) => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/friendEmail",
  //       { senderEmail: state.email, receiverEmail: user.email }, { withCredentials: true })
  //       // console.log(response.data._id)
  //     setMessageByFriend(response.data)
  //   } catch (error) {
  //     console.log(error.response.data)
  //     console.log(error)
  //   }

  // }


  useEffect(() => {
    const getDataByFriendId = async () => {
      const friendEmail = friend.members.find((i) => { return (i !== state.email) })
      // console.log(friendEmail)
      try {
        const response = await axios.post(process.env.REACT_APP_API_URL + "/emailData",
          { email: friendEmail }, { withCredentials: true })
        setUser(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    if (search === "") {
      getDataByFriendId()
    }
    return () => {}
  }, [friend, state, search])

  useEffect(() => {
    if (search !== "" && user) {
      let name = user.name.toLowerCase()
      let find = search.toLowerCase()
      if (name.includes(find)) {
      } else {
        setUser(false)
      }
    }
  }, [search, user])


  return (
    <div>
      {user ? <li key={index} onClick={(e) => { setMessageByFriend(friend, user) }}>
        <div className={"px-4 chat-list-conversation " + (clicked._id === friend._id ? "active" : "")} href="/dashboard">
          <div className="d-flex align-items-center">
            <div className="chat-user-img align-self-center me-2">
              <div className="avatar-conversation align-self-center">
                <span className="avatar-title rounded-circle bg-secondary">{user.name?.slice(0, 1)}
                </span>
              </div>
            </div>
            <div className="overflow-hidden">
              <h6 className="text-truncate mb-0">{user.name}</h6>
            </div>
          </div>
        </div>
      </li> : <div></div>}
      {/* {user ? <Card
        bg={clicked === data ? "primary" : "light"}
        key={index}
        text={clicked === data ? "light" : "dark"}
        style={styleObj}
        className="mb-4"
        // onMouseOver={changeBlue}
        // onMouseLeave={changeLight}
        onClick={(e) => setMessageByFriend(data)}
      >
        <Card.Body>
          <Card.Title>{user.name}</Card.Title>
          <Card.Text>{user.email}</Card.Text>
        </Card.Body>
      </Card> : <div>Loading</div>} */}
    </div>
  )
}


export default Friend