import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import './index.css';
import { Modal, Button } from 'react-bootstrap';
import Notification from "./Notification";
import "bootstrap/dist/css/bootstrap.min.css"
import { SocketContext } from "../context/socket";


const NotificationModal = ({ setNotificationReceived, isOpen, toggleModal }) => {

  const [allNotification, setAllNotifications] = useState(false)
  const { socket } = useContext(SocketContext)
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })


  useEffect(() => {
    socket.socket?.current.on("notification", async () => {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/allNotification", { withCredentials: true })
      if (isOpen) {
        setAllNotifications(response.data)
      }
    })
  }, [socket, isOpen])

  useEffect(() => {
    const getAllNotifications = async () => {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/allNotification", { withCredentials: true })
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].status === "notSeen") {
          setNotificationReceived(true)
        }
      }
      if (isOpen) {
        setAllNotifications(response.data)
      }
    }
    getAllNotifications()
    return () => { setAllNotifications(false) }
  }, [isOpen, setNotificationReceived])


  const RemoveNotification = (data) => {
    const newNotifications = allNotification.filter((e) => e !== data)
    setAllNotifications(newNotifications)
  }

  return (
    <div>
      <Modal show={isOpen} onHide={() => { toggleModal(); setAllNotifications(false) }} animation={false}>
        <Modal.Header>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {allNotification ?
            allNotification?.map((item, i) => {
              return <Notification RemoveNotification={RemoveNotification} data={item} key={i} index={i} />
            }) : <div>Loading</div>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { toggleModal(); setAllNotifications(false) }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default NotificationModal