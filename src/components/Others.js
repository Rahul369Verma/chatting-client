import { useState, useContext } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import { Context } from '../context';





const Others = ({ data, index }) => {

  const [color, setColor] = useState("light")
  const { state } = useContext(Context)
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })



  const styleObj = {
    width: '29rem',
    cursor: "pointer",
    "&:hover": {
      background: "blue"
    },
  }

  const changeBlue = (e) => {
    setColor("primary")
  }
  const changeLight = (e) => {
    setColor("light")
  }

  const sendRequest = async (e) => {
    try {
      const response = await axiosInstance.post("addFriend",
        { senderEmail: state.email, receiverEmail: data.email }, { withCredentials: true })
      if (response.data === null) {
        console.log("you are already friends")
      } else {
        console.log("Friend Added Successfully")
      }
    } catch (error) {
      console.log(error)
    }

  }



  return (
    <Card
      bg={color}
      key={index}
      text="Light"
      style={styleObj}
      className="mb-4"
      onMouseOver={changeBlue}
      onMouseLeave={changeLight}
      onClick={sendRequest}
    >
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>{data.email}</Card.Text>
      </Card.Body>
    </Card>
  )
}


export default Others