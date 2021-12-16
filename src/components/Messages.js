import { useContext } from "react"
import { Context } from '../context';
import { Card } from "react-bootstrap";
import { format } from "timeago.js";


const Messages = ({ message, index, conversation }) => {


  const { state } = useContext(Context)


  const senderStyle = {
    width: '20rem',
    marginLeft: "9rem"
  }
  const receiverStyle = {
    width: '20rem'
  }

  const showTicks = () => {
    if (message.status === "seen") {
      return <ion-icon style={{ color: "red" }} name="done-all"></ion-icon>
    } else if (message.status === "delivered") {
      return <ion-icon name="done-all"></ion-icon>
    }else{
      return <ion-icon name="checkmark"></ion-icon>
    }
  }


  return (
    <div>
      <Card
        bg={message.senderEmail === state.email ? "light" : "primary"}
        key={index}
        text={message.senderEmail === state.email ? "dark" : "light"}
        style={message.senderEmail === state.email ? senderStyle : receiverStyle}
        className="mt-4"
      >
        <Card.Body>
          <Card.Text>{message.message}</Card.Text>
        </Card.Body>
      </Card>
      <div style={message.senderEmail === state.email ? { marginLeft: "20rem" } : {}}>
        <small
          className="text-muted">
          {format(message.createdAt)}
        </small>
        {message.senderEmail === state.email && showTicks()}
      </div>
    </div>
  )
}


export default Messages