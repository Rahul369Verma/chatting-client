import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react"
import { Context } from '../context';
import "./whatsapp.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Messages from "./Messages";
import Conversation from "./Conversation";
import Others from "./Others";
import Friends from "./Friends";
import { Modal } from "react-bootstrap";
import Auth from '../isAuth';
import { SearchContext } from '../context/searchItem';
import { io } from "socket.io-client"
import { SocketContext } from "../context/socket";



const Chatting = () => {


	const { state } = useContext(Context)
	const [scroll, setScroll] = useState("")
	const [friendData, setFriendData] = useState(JSON.parse(sessionStorage.getItem("friendData")) || {})
	const [conversations, setConversations] = useState([])
	const [messageConversation, setMessageConversation] = useState(false)
	const [messageFriend, setMessageFriend] = useState(false)
	const { search } = useContext(SearchContext)
	const { socketDispatch } = useContext(SocketContext)
	const [messageData, setMessageData] = useState([])
	const [inputData, setInputData] = useState("")
	const [arrivalMessage, setArrivalMessage] = useState(false)
	const [activeUsers, setActiveUsers] = useState([])
	const socket = useRef()
	const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })


	const changeInput = (e) => {
		setInputData(e.target.value);
		if (messageConversation) {
			if (friendData) {
				socket.current.emit("typing", { messageConversation: messageConversation, friendData: friendData })
			}
		}
	}




	const sendMessage = async (e) => {
		e.preventDefault()
		const messageForm = {
			conversationId: messageConversation._id,
			friendId: messageFriend._id,
			senderEmail: state.email,
			message: inputData
		}
		console.log(messageForm)
		try {
			const response = await axiosInstance.post("messagePost", messageForm, { withCredentials: true })
			console.log("Message send successfully", response.data)
			setInputData("")
			setMessageData(prev => [...prev, response.data])
			if (messageConversation) {
				const res = await axiosInstance.post("friendId", { friendCollectionId: messageConversation.friendCollectionId }, { withCredentials: true })
				const receiverEmail = res.data.members.find((i) => { return (i !== state.email) })
				socket.current.emit("sendMessage", {
					friend: false,
					conversationId: messageConversation._id,
					senderEmail: state.email,
					text: inputData,
					receiverEmail
				})
			} else {
				const receiverEmail = messageFriend.members.find((i) => { return (i !== state.email) })
				socket.current.emit("sendMessage", {
					friend: messageFriend,
					conversationId: response.data.conversationId,
					senderEmail: state.email,
					text: inputData,
					receiverEmail
				})
			}

		} catch (error) {
			if (error.response?.status === 403) {
				await axiosInstance.get("refreshToken", { withCredentials: true })
			}
			console.log(error, error.response?.data)
		}
	}

	useEffect(() => {
		const scrollToBottom = () => {
			scroll?.scrollIntoView({ behavior: "smooth" });
		}
		if (scroll !== "") {
			scrollToBottom()
		}
	}, [messageData, scroll])

	useEffect(() => {
		socket.current = io(process.env.REACT_APP_SOCKET_URL,, { transports: ['websocket'] })
		socketDispatch({
			type: "Change",
			payload: socket
		})

	}, [socketDispatch]) //to run single time only

	useEffect(() => {
		const getConversations = async () => {
			const response = await axios.get(process.env.REACT_APP_API_URL + "/allConversations", { withCredentials: true })
			setConversations(response.data)
		}
		if (arrivalMessage?.friend) {
			getConversations()
			setArrivalMessage(false)
		} else {
			if (arrivalMessage) {
				console.log(arrivalMessage)
				if (messageConversation?._id === arrivalMessage.conversationId) {
					socket.current.emit("messageSeen", {
						conversationId: arrivalMessage.conversationId,
						senderEmail: arrivalMessage.senderEmail
					})
					setMessageData(prev => [...prev, arrivalMessage])
					if (messageConversation.newMessage) {
						getConversations()
					}
				} else {
					getConversations()
					socket.current.emit("messageDelivered", {
						conversationId: arrivalMessage.conversationId,
						senderEmail: arrivalMessage.senderEmail
					})
				}
			}
		}
	}, [arrivalMessage, messageConversation])

	useEffect(() => {
		if (state.email) {
			socket.current.emit("addUser", state.email)
			socket.current.on("getUsers", users => {
				// console.log(users)
				setActiveUsers(users)
			})
		}
		if (sessionStorage.getItem("messageFriend") || false) {
			setMessageFriend(JSON.parse(sessionStorage.getItem("messageFriend")))
		} else if (sessionStorage.getItem("messageConversation") || false) {
			setMessageConversation(JSON.parse(sessionStorage.getItem("messageConversation")))
		}
	}, [state])

	useEffect(() => {
		const seen = async (id) => {
			await axios.post(process.env.REACT_APP_API_URL + "/seen",
				{ id: id }, { withCredentials: true })
			const response = await axios.post(process.env.REACT_APP_API_URL + "/messageGet",
				{ conversationId: id }, { withCredentials: true })
			setMessageData(response.data)
		}
		const delivered = async (id) => {
			await axios.post(process.env.REACT_APP_API_URL + "/delivered",
				{ id: id }, { withCredentials: true })
			const response = await axios.post(process.env.REACT_APP_API_URL + "/messageGet",
				{ conversationId: id }, { withCredentials: true })
			setMessageData(response.data)
		}
		socket.current.on("welcome", message => {
			console.log(message)
		})
		socket.current.on("getMessage", (data) => {
			console.log("message Received")
			setArrivalMessage({
				friend: data.friend,
				conversationId: data.conversationId,
				senderEmail: data.senderEmail,
				message: data.text,
				createdAt: Date.now()
			})
		})
		socket.current.on("getMessageSeen", ({ conversationId }) => {
			console.log("id received", conversationId)
			seen(conversationId)
		})
		socket.current.on("getMessageDelivered", ({ conversationId }) => {
			delivered(conversationId)
		})
		console.log("hello")
	}, [socket])


	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await axios.get(process.env.REACT_APP_API_URL + "/allConversations", { withCredentials: true })
				setConversations(response.data)
			} catch (err) {
				if (err.response?.status === 403) {
					console.log("receive 403 from token user");
					try {
						await axios.get(process.env.REACT_APP_API_URL + "/refreshToken", { withCredentials: true })
						const res = await axios.get(process.env.REACT_APP_API_URL + "/allConversations", { withCredentials: true })
						setConversations(res.data)
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
		if (search.searchedItem === null) {
			getUser()
			setMessageFriend(false)
		}
	}, [search])

	useEffect(() => {
		const sendSeen = async (c) => {
			await axios.post(process.env.REACT_APP_API_URL + "/seen",
				{ id: c._id }, { withCredentials: true })
		}
		const sendDelivered = async (c) => {
			await axios.post(process.env.REACT_APP_API_URL + "/delivered",
				{ conversation: c._id }, { withCredentials: true })
		}
		conversations.forEach(i => {
			if (i.newMessage === true) {
				console.log("my id", messageConversation?._id)
				console.log("c id", i._id)
				if (i.senderEmail !== state.email) {
					if (i._id === messageConversation?._id) {
						sendSeen(i)
					} else {
						sendDelivered(i)
					}
				}
			}
		})
	}, [conversations, messageConversation, state])

	useEffect(() => {
		const getConversation = async () => {
			try {
				const response = await axios.post(process.env.REACT_APP_API_URL + "/messageGet",
					{ conversationId: messageConversation._id }, { withCredentials: true })
				setMessageData(response.data)
			} catch (error) {
				console.log(error)
			}
		}
		if (messageConversation) {
			getConversation()
		} else {
			setMessageData([])
		}
	}, [messageConversation])

	const MessageConversation = (conversation, friendData) => {
		sessionStorage.setItem("messageConversation", JSON.stringify(conversation));
		sessionStorage.setItem("friendData", JSON.stringify(friendData));
		sessionStorage.removeItem("messageFriend")
		setMessageFriend(false)
		setFriendData(friendData)
		setMessageConversation(conversation)
	}

	const MessageFriend = async (friend) => {
		try {
			const response = await axiosInstance.post("conversationId",
				{ friendId: friend._id }, { withCredentials: true })
			if (response.data === "") {
				sessionStorage.setItem("messageFriend", JSON.stringify(friend));
				sessionStorage.removeItem("messageConversation")
				sessionStorage.removeItem("friendData")
				setMessageConversation(false)
				setMessageFriend(friend)
			} else {
				sessionStorage.setItem("messageConversation", JSON.stringify(response.data));
				sessionStorage.removeItem("messageFriend")
				setMessageFriend(false)
				setMessageConversation(response.data)
			}
		} catch (error) {
			console.log(error)
		}
	}



	if (Auth.getAuth()) {
		return (
			<div>
				<div className="split left">
					<Modal.Dialog>

						<Modal.Body>
							{search.searchedItem === null && <Modal.Header key="recent-search" >
								<Modal.Title>Recent</Modal.Title>
							</Modal.Header>}

							{search.searchedItem === null ?
								(conversations.map((item, i) => {
									if (item.email === state.email) {
										return null
									}
									return <Conversation conversation={item} key={i} index={i} setMessageByConversation={MessageConversation} clicked={messageConversation} active={activeUsers} />
								})) : (
									<>
										<Modal.Header key="recent">
											<Modal.Title>Recent</Modal.Title>
										</Modal.Header>
										{search.searchedItem.conversations.map((searchItem, i) => (
											<Conversation conversation={searchItem} key={i} index={i} setMessageByConversation={MessageConversation} clicked={messageConversation} active={activeUsers} />
										))}
										<Modal.Header key="friends">
											<Modal.Title>Friends</Modal.Title>
										</Modal.Header>
										{search.searchedItem.friends.map((searchItem, i) => (
											<Friends data={searchItem} key={i} index={i} setMessageByFriend={MessageFriend} clicked={messageFriend} />
										))}
										<Modal.Header key="others">
											<Modal.Title>Others</Modal.Title>
										</Modal.Header>
										{search.searchedItem.others.map((searchItem, i) => {
											if (searchItem.email === state.email) return null
											return <Others data={searchItem} key={i} index={i} />
										})}
									</>
								)
							}
						</Modal.Body>

						<Modal.Footer>
						</Modal.Footer>
					</Modal.Dialog>
				</div >

				<div className="split right">
					<Modal.Dialog>
						<Modal.Header >
							<Modal.Title>Messages</Modal.Title>
						</Modal.Header>

						<Modal.Body>
							{
								messageData.map((m, i) => (
									< Messages message={m} key={i} index={i} conversation={messageConversation} />
								))
							}
						</Modal.Body>

						<Modal.Footer >
							{(messageFriend || messageConversation) ?
								<form className="d-flex" onSubmit={sendMessage} ref={(el) => { setScroll(el) }}>
									<input style={{ height: "60px", width: "300px" }} className="form-control me-4 mt-2" value={inputData}
										type="search" placeholder="Search" aria-label="Search" onChange={changeInput} />
									<button className="btn btn-outline-success" type="submit">Send</button>
								</form> : <></>
							}
							{/* <InputGroup className="mb-3">
								<FormControl
									placeholder="Recipient's username"
									aria-label="Recipient's username"
									aria-describedby="basic-addon2"
									value={inputData}
									onChange={changeInput}
								/>
								<Button size="lg" onSubmit={sendMessage} variant="success" id="button-addon2">
									Button
								</Button>
							</InputGroup> */}
						</Modal.Footer>
					</Modal.Dialog>
				</div>
			</div >
		)
	} else if (Auth.getAuth() === false) {
		<p>
			You need To login First
		</p>
	}

	return (
		<div>
			{state.email === null && <h1>Loading</h1>}
			{state.email === false && <h1>First you have to Login/Register</h1>}
		</div>
	)
}

export default Chatting
