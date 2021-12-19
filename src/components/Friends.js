import { useState, useContext, useEffect } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import { Context } from '../context';




const Friends = ({ data, index, setMessageByFriend, clicked }) => {

  // const [color, setColor] = useState("light")
  const [user, setUser] = useState(false)
  const { state } = useContext(Context)



  const styleObj = {
    width: '29rem',
    cursor: "pointer",
    "&:hover": {
      background: "blue"
    },
  }

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
      const friendEmail = data.members.find((i) => { return (i !== state.email) })
      // console.log(friendEmail)
      try {
        const response = await axios.post(process.env.REACT_APP_API_URL + "/emailData",
          { email: friendEmail }, { withCredentials: true })
        setUser(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    getDataByFriendId()
    return () => { setUser(false) }
  }, [data, state])


  return (
    <div>
      {user ? <Card
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
      </Card> : <div>Loading</div>}
    </div>
  )
}


export default Friends