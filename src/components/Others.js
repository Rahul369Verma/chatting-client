import { useState, useContext, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import { Context } from '../context';
import { SocketContext } from "../context/socket";





const Others = ({ data, index }) => {

  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)
  const [checkRequest, setCheckRequest] = useState("")
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })



  const styleObj = {
    width: '29rem',
  }


  const sendRequest = async () => {
    try {
      setCheckRequest(true)
      const response = await axiosInstance.post("sendFriendRequest",
        { senderEmail: state.email, receiverEmail: data.email }, { withCredentials: true })
        let email = data.email
      socket.socket?.current.emit("notification", {email})
    } catch (error) {
      setCheckRequest(false)
      console.log(error)
    }
  }
  const cancelRequest = async () => {
    const response = await axiosInstance.post("cancelFriendRequest",
      { senderEmail: state.email, receiverEmail: data.email }, { withCredentials: true })
    setCheckRequest(false)
    console.log("notification removed", response.data)
  }

  useEffect(() => {
    const checkRequest = async () => {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/checkFriendRequest",
        { senderEmail: state.email, receiverEmail: data.email, type: "friendRequest" }, { withCredentials: true })
      setCheckRequest(response.data)
    }
    checkRequest()
    return() => {setCheckRequest("")}
  }, [data, state])



  return (
    <Card
      key={index}
      text="Light"
      style={styleObj}
      className="mb-4"
    >
      <Card.Body>
        <Card.Title>{data.name}{checkRequest === ""? <></> : (checkRequest ? <Button style={{ marginLeft: "20%" }} onClick={cancelRequest}>Cancel</Button> : <Button style={{ marginLeft: "20%" }} onClick={sendRequest}>Add Friend</Button>)}</Card.Title>
        <Card.Text>{data.email}</Card.Text>
      </Card.Body>
    </Card>
  )
}


export default Others