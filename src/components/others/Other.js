import { useState, useContext, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import "./Other.css"
import { Context } from '../../context';
import { SocketContext } from "../../context/socket";





const Other = ({ other, index }) => {

  const { state } = useContext(Context)
  const { socket } = useContext(SocketContext)
  const [checkRequest, setCheckRequest] = useState("")
  const [requestReceived, setRequestReceived] = useState(false)
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })



  // const styleObj = {
  //   width: '29rem',
  // }
  

  const acceptRequest = async () => {
    let data = {
      senderEmail: other.email,
      receiverEmail: state.email
    }
    const response = await axiosInstance.post("acceptFriendRequest",
      { data: data }, { withCredentials: true })
    console.log(response.data)
    let email = data.senderEmail
    socket.socket?.current.emit("notification", { email })
  }
  const removeRequest = async () => {
    let data = {
      senderEmail: other.email,
      receiverEmail: state.email
    }
    const response = await axiosInstance.post("removeFriendRequest",
      { data: data }, { withCredentials: true })
    console.log("notification removed", response.data)
    console.log(socket)
    if (socket !== null) {
      let email = data.senderEmail
      socket.socket?.current.emit("notification", { email })
    }
  }

  const sendRequest = async () => {
    try {
      setCheckRequest(true)
      const response = await axiosInstance.post("sendFriendRequest",
        { senderEmail: state.email, receiverEmail: other.email }, { withCredentials: true })
      let email = other.email
      socket.socket?.current.emit("notification", { email })
    } catch (error) {
      setCheckRequest(false)
      console.log(error)
    }
  }
  const cancelRequest = async () => {
    const response = await axiosInstance.post("cancelFriendRequest",
      { senderEmail: state.email, receiverEmail: other.email }, { withCredentials: true })
    setCheckRequest(false)
    console.log("notification removed", response.data)
  }

  useEffect(() => {
    const checkRequest = async () => {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/checkFriendRequest",
        { firstEmail: state.email, secondEmail: other.email, type: "friendRequest" }, { withCredentials: true })
        if(response.data.senderEmail === state.email){
          setCheckRequest(true)
        }else if(response.data.senderEmail === other.email){
          setRequestReceived(true)          
        }else{
          setCheckRequest(false)
          setRequestReceived(false) 
        }
    }
    checkRequest()
    return () => { setCheckRequest("") }
  }, [other, state])



  return (
    <div>
    <li key={index}>
      <div className="px-4 chat-list-conversation d-flex" style={{ cursor: "default" }}>
        <div className="d-flex align-items-center">
          <div className="chat-user-img align-self-center me-2">
            <div className="avatar-conversation align-self-center">
              <span className="avatar-title rounded-circle bg-secondary">{other.name.slice(0, 1)}
              </span>
            </div>
          </div>
          <div className="overflow-hidden">
            <h6 className="text-truncate mb-0">{other.name}</h6>
            <h6 className="text-truncate mb-0 overflow-visible">{other.email}</h6>
          </div>
        </div>
        {(!checkRequest && !requestReceived) &&  <Button onClick={sendRequest} className="friendButton mx-auto my-auto" size="sm">Add Friend</Button>}
        {(checkRequest && !requestReceived) && <Button onClick={cancelRequest} className="friendButton mx-auto my-auto" size="sm">Cancel</Button>}
      </div>
      {(!checkRequest && requestReceived) && <div className="d-flex">
      <div className="mx-auto">
        <Button className="my-auto mx-auto">Accept</Button>
      </div>
      <div className="mx-auto">
        <Button className="my-auto mx-auto">Reject</Button>
      </div>
    </div>}
    </li>
    </div >
  )
}


export default Other
// {/* <Card
//         key={index}
//         text="Light"
//         style={styleObj}
//         className="mb-4"
//       >
//         <Card.Body>
//           <Card.Title>{data.name}{checkRequest === "" ? <></> :
//             (checkRequest ? <Button style={{ marginLeft: "20%" }} onClick={cancelRequest}>Cancel</Button>
//               : <Button style={{ marginLeft: "20%" }} onClick={sendRequest}>Add Friend</Button>)}</Card.Title>
//           <Card.Text>{data.email}</Card.Text>
//         </Card.Body>
//       </Card> */}