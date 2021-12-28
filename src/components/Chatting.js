import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react"
import { Context } from '../context';
import "./whatsapp.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Messages from "./Messages";
import Conversation from "./conversation/Conversation";
import Others from "./others/Others";
import Friends from "./friends/Friends";
import { Modal } from "react-bootstrap";
import Auth from '../isAuth';
import { io } from "socket.io-client"
import { SocketContext } from "../context/socket";
import { NavigatorContext } from '../context/Navigator';
import SearchBar from "./SearchBar/SearchBar";
import SendInput from "./sendInput/SendInput";
import TopBar from "./TopBar/TopBar";
import Chat from "./chat/Chat";
import FriendRequests from "./friendRequest/FriendRequests";



const Chatting = () => {


	const { state } = useContext(Context)
	const { navigator, navigatorDispatch } = useContext(NavigatorContext)
	const [scroll, setScroll] = useState("")
	const [friendData, setFriendData] = useState(JSON.parse(sessionStorage.getItem("friendData")) || false)
	const [messageConversation, setMessageConversation] = useState(false)
	const [messageFriend, setMessageFriend] = useState(false)
	const { socketDispatch } = useContext(SocketContext)
	const [messageData, setMessageData] = useState([])
	// const [arrivalMessage, setArrivalMessage] = useState(false)
	const [activeUsers, setActiveUsers] = useState([])
	const socket = useRef()
	const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL })









	useEffect(() => {
		const scrollToBottom = () => {
			scroll?.scrollIntoView({ behavior: "smooth" });
		}
		if (scroll !== "") {
			scrollToBottom()
		}
	}, [messageData, scroll])

	useEffect(() => {

		socket.current = io(process.env.REACT_APP_SOCKET_URL, { transports: ['websocket'] })
		socketDispatch({
			type: "Change",
			payload: socket
		})

	}, [socketDispatch]) //to run single time only

	// useEffect(() => {
	// 	if (arrivalMessage) {
	// 		console.log(arrivalMessage)

	// 	}
	// }, [arrivalMessage, messageConversation])

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
		const seen = async (arrivalMessage) => {
			await axios.post(process.env.REACT_APP_API_URL + "/seen",
				{ id: arrivalMessage._id }, { withCredentials: true })
			setMessageData(prev => [...prev, arrivalMessage])
			setMessageConversation((prev) => ({ ...prev, lastMessageId: arrivalMessage._id, lastMessage: arrivalMessage.message }))
			socket.current.emit("messageSeen", {
				conversationId: arrivalMessage.conversationId,
				senderEmail: arrivalMessage.senderEmail,
				_id: arrivalMessage._id
			})
		}
		const delivered = async (arrivalMessage) => {
			await axios.post(process.env.REACT_APP_API_URL + "/deliveredById",
				{ id: arrivalMessage._id }, { withCredentials: true })
			socket.current.emit("messageDelivered", {
				all: false,
				conversationId: arrivalMessage.conversationId,
				_id: arrivalMessage._id,
				senderEmail: arrivalMessage.senderEmail
			})
		}
		socket.current.on("welcome", message => {
			console.log(message)
		})
		socket.current.on("getMessage", async (data) => {
			console.log("message Received", data)
			console.log(messageConversation._id)
			if (messageConversation._id === data.conversationId) {
				let arrivalMessage = {
					_id: data._id,
					conversationId: data.conversationId,
					senderEmail: data.senderEmail,
					message: data.text,
					status: "seen",
					createdAt: Date.now()
				}
				console.log("hits")
				await seen(arrivalMessage)
			} else {
				let deliverMessage = {
					_id: data._id,
					senderEmail: data.senderEmail,
				}
				await delivered(deliverMessage)
			}
		})
	}, [messageConversation._id])


	useEffect(() => {
		socket.current.on("getMessageSeen", ({ _id, conversationId }) => {
			console.log("message Seen", _id)
			if (messageConversation._id === conversationId) {
				setMessageData((prev) => {
					return prev.map(message => {
						if (message._id === _id) {
							return {
								...message,
								status: "seen"
							}
						}
						return message
					})
				})
			}
		})
		const getMessages = async () => {
			try {
				const response = await axios.post(process.env.REACT_APP_API_URL + "/messageGet",
					{ conversationId: messageConversation._id }, { withCredentials: true })
				setMessageData(response.data)
			} catch (error) {
				console.log(error)
			}
		}
		socket.current.on("getMessageDelivered", ({ _id, conversationId, all }) => {
			console.log("message delivered")
			if (all) {
				getMessages()
			} else {
				if (messageConversation._id === conversationId) {
					setMessageData((prev) => {
						return prev.map(message => {
							if (message._id === _id) {
								return {
									...message,
									status: "delivered"
								}
							}
							return message
						})
					})
				}
			}
		})
	}, [messageConversation._id, socket])

	useEffect(() => {
		const getMessages = async () => {
			try {
				const response = await axios.post(process.env.REACT_APP_API_URL + "/messageGet",
					{ conversationId: messageConversation._id }, { withCredentials: true })
				setMessageData(response.data)
			} catch (error) {
				console.log(error)
			}
		}
		if (messageConversation) {
			getMessages()
		} else {
			setMessageData([])
		}
	}, [messageConversation])

	const MessageConversation = (conversation, friendData) => {
		sessionStorage.setItem("messageConversation", JSON.stringify(conversation));
		sessionStorage.setItem("friendData", JSON.stringify(friendData));
		sessionStorage.removeItem("messageFriend")
		setMessageFriend(false)
		console.log("Message Conversation")
		setFriendData(friendData)
		setMessageConversation(conversation)
	}

	const MessageFriend = async (friend, friendData) => {
		try {
			const response = await axiosInstance.post("conversationId",
				{ friendId: friend._id }, { withCredentials: true })
			if (response.data === "") {
				console.log("Message Friend")
				sessionStorage.setItem("messageFriend", JSON.stringify(friend));
				sessionStorage.setItem("friendData", JSON.stringify(friendData));
				sessionStorage.removeItem("messageConversation")
				setMessageConversation(false)
				setFriendData(friendData)
				setMessageFriend(friend)
			} else {
				console.log("Message Friend Conversation")
				sessionStorage.setItem("messageConversation", JSON.stringify(response.data));
				sessionStorage.removeItem("messageFriend")
				sessionStorage.setItem("friendData", JSON.stringify(friendData));
				setFriendData(friendData)
				setMessageFriend(false)
				setMessageConversation(response.data)
			}
		} catch (error) {
			console.log(error)
		}
	}

	console.log(messageConversation)



	if (Auth.getAuth()) {
		return (
			<div style={{ position: "relative" }}>
				<div className="split left">
					{navigator.selected === "chat" && <div>
						<Chat messageConversation={messageConversation} MessageConversation={MessageConversation} activeUsers={activeUsers} />
					</div>}
					{navigator.selected === "friends" && <div>
						<Friends MessageFriend={MessageFriend} />
					</div>}
					{navigator.selected === "others" && <div>
						<Others />
					</div>}
					{navigator.selected === "friendRequests" && <div>
						<FriendRequests />
					</div>}
					{/* <div className="px-4 pt-2">
							<div className="">
								<h3>Recent</h3>
								<ul>
									{search.searchedItem.conversations.map((searchItem, i) => (
										<Conversation conversation={searchItem} key={i} index={i} setMessageByConversation={MessageConversation} clicked={messageConversation} active={activeUsers} />
									))}
								</ul>
							</div>
							<h3>Friends</h3>
							{search.searchedItem.friends.map((searchItem, i) => (
								<Friends data={searchItem} key={i} index={i} setMessageByFriend={MessageFriend} clicked={messageFriend} />
							))}
							<h3>Others</h3>
							{search.searchedItem.others.map((searchItem, i) => {
								if (searchItem.email === state.email) return null
								return <Others data={searchItem} key={i} index={i} />
							})}
						</div> */}

				</div >
				<div className={"split right " + (!messageFriend && !messageConversation ? "hide" : "show")} id="wrapper">
					{(friendData) ? <TopBar friendData={friendData} activeUsers={activeUsers} messageConverId={messageConversation._id} /> : <></>}

					<div className="message-outer">
						<ul className="force-overflow scrollbar" id="message-scroll">
							{
								messageConversation && messageData.map((m, i) => (
									< Messages messageConversationNewMessage={messageConversation.newMessage} setMessageConversation={setMessageConversation} setScroll={setScroll} message={m} key={i} index={i} messageConversationId={messageConversation._id} messageConversationLastId={messageConversation.lastMessageId} />
								))
							}
						</ul>
					</div>

				</div>
				{(messageFriend || messageConversation) ?
					<SendInput setMessageConversation={setMessageConversation} MessageConversation={MessageConversation} messageConversationId={messageConversation._id} friendData={friendData} messageFriend={messageFriend} setMessageData={setMessageData} />
					: <></>
				}
			</div >
		)
	} else if (Auth.getAuth() === false) {
		return (
			<div>
				{state.email === null && <h1>Loading</h1>}
				{state.email === false && <h3>
					You need To login First
				</h3 >}
			</div>
		)
	}

	return (
		<div>
			{state.email === null && <h1>Loading</h1>}
			{state.email === false && <h1>First you have to Login/Register</h1>}
		</div>
	)
}

export default Chatting
