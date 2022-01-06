import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react"
import { Context } from '../context';
import "./whatsapp.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Messages from "./Messages";
import Conversation from "./conversation/Conversation";
import Others from "./others/Others";
import Friends from "./friends/Friends";
import Auth from '../isAuth';
import { io } from "socket.io-client"
import { SocketContext } from "../context/socket";
import { NavigatorContext } from '../context/Navigator';
import SendInput from "./sendInput/SendInput";
import TopBar from "./TopBar/TopBar";
import Chat from "./chat/Chat";
import FriendRequests from "./friendRequest/FriendRequests";
import Loader from "./loader/loader";
import NotFriends from "./sendInput/NotFriend";



const Chatting = () => {


	const { state } = useContext(Context)
	const [notFriend, setNotFriend] = useState(false)
	const { navigator, navigatorDispatch } = useContext(NavigatorContext)
	const [scroll, setScroll] = useState("")
	const [getMessage, setGetMessage] = useState(false)
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


	useEffect(() => {
		if (state.email) {
			socket.current.emit("addUser", state.email)
			socket.current.on("getUsers", users => {
				// console.log(users)
				setActiveUsers(users)
			})
		}
		// if (sessionStorage.getItem("messageFriend") || false) {
		// setMessageFriend(JSON.parse(sessionStorage.getItem("messageFriend")))

	}, [state])

	useEffect(() => {
		if (sessionStorage.getItem("messageConversation") || false) {
			setMessageConversation(JSON.parse(sessionStorage.getItem("messageConversation") || false))
		}
		if (sessionStorage.getItem("friendData") || false) {
			setFriendData(JSON.parse(sessionStorage.getItem("friendData") || false))
		}
		if (sessionStorage.getItem("messageFriend") || false) {
			setMessageFriend(true)
		}
		if (sessionStorage.getItem("notFriend") || false) {
			setNotFriend(true)
		}
	}, [])

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
		socket.current.on("getMessage", (data) => {
			setGetMessage(data)
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
				seen(arrivalMessage)
			} else {
				console.log("this hits")
				let deliverMessage = {
					conversationId: data.conversationId,
					_id: data._id,
					senderEmail: data.senderEmail,
				}
				delivered(deliverMessage)
			}
		})
		return () => {
			socket.current.off("welcome");
			socket.current.off("getMessage");
		};
	}, [messageConversation, socket])


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
		socket.current.on("getMessageSeen", ({ _id, conversationId }) => {
			console.log("message Seen", _id)
			if (messageConversation?._id === conversationId) {
				// getMessages()
				// let newArray = messageData
				// for (let i = 0; i < newArray.length; i++) {
				// 	if(newArray[i]._id === _id){
				// 		console.log("seen")
				// 		newArray[i].status = "seen"
				// 	}
				// }
				// setMessageData(newArray)
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
		socket.current.on("getMessageDelivered", ({ _id, conversationId, all }) => {
			console.log("message delivered", messageConversation, conversationId)
			if (messageConversation?._id === conversationId) {
				if (all) {
					getMessages()

				} else {
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
		return () => {
			socket.current.off("getMessageSeen");
			socket.current.off("getMessageDelivered");
		};
	}, [messageConversation, socket, messageData])

	useEffect(() => {
		const getMessages = async () => {
			try {
				const response = await axios.post(process.env.REACT_APP_API_URL + "/messageGet",
					{ conversationId: messageConversation._id }, { withCredentials: true })
				console.log("get messages")
				setMessageData(response.data)
			} catch (error) {
				console.log(error)
			}
		}
		if (messageConversation?._id) {
			getMessages()
		} else {
			setMessageData([])
		}
	}, [messageConversation?._id])

	// const MessageConversation = async (conversation, friendData) => {
	// 	const response = await axios.post(process.env.REACT_APP_API_URL + "/isFriend?email=" + friendData.email
	// 		, { withCredentials: true })
	// 	if (response.data === true) {
	// 		sessionStorage.setItem("messageConversation", JSON.stringify(conversation));
	// 		sessionStorage.setItem("friendData", JSON.stringify(friendData));
	// 		// sessionStorage.removeItem("messageFriend")
	// 		// setMessageFriend(false)
	// 		// console.log("Message Conversation")
	// 		setFriendData(friendData)
	// 		setMessageConversation(conversation)
	// 	} else {
	// 		sessionStorage.removeItem("messageFriend")
	// 		sessionStorage.removeItem("messageConversation")
	// 		setFriendData(friendData)
	// 		setNotFriend(true)
	// 	}
	// }

	const MessageFriend = async (friendData, conversation) => {
		try {
			const response = await axios.get(process.env.REACT_APP_API_URL + "/isFriend?email=" + friendData.email
				, { withCredentials: true })
			if (response.data.isFriend === true) {
				setNotFriend(false)
				sessionStorage.removeItem("notFriend")
				sessionStorage.setItem("friendData", JSON.stringify(friendData));
				setFriendData(friendData)
				if (response.data.conversation) {
					sessionStorage.setItem("messageConversation", JSON.stringify(response.data.conversation));
					setMessageConversation(response.data.conversation)
					sessionStorage.removeItem("messageFriend")
					setMessageFriend(false)
				} else {
					console.log("friend")
					setMessageFriend(true)
					sessionStorage.setItem("messageFriend", true)
					setMessageConversation(false)
					sessionStorage.removeItem("messageConversation")
				}
			} else {
				setMessageConversation(conversation)
				sessionStorage.setItem("messageConversation", JSON.stringify(conversation))
				setMessageFriend(false)
				sessionStorage.removeItem("messageFriend")
				setFriendData(friendData)
				sessionStorage.setItem("friendData", JSON.stringify(friendData))
				setNotFriend(true)
				sessionStorage.setItem("notFriend", true);
			}
		} catch (error) {
			console.log(error)
		}
	}




	if (Auth.getAuth()) {
		return (
			<div className="split" style={{}}>
				<div className="d-flex">
					<div className="left">
						{navigator.selected === "chat" && <div>
							<Chat getMessage={getMessage} setGetMessage={setGetMessage} messageConversation={messageConversation} MessageFriend={MessageFriend} activeUsers={activeUsers} />
						</div>}
						{navigator.selected === "friends" && <div>
							<Friends MessageFriend={MessageFriend} />
						</div>}
						{navigator.selected === "others" && <div>
							<Others messageConversation={messageConversation} friendData={friendData} MessageFriend={MessageFriend} />
						</div>}
						{navigator.selected === "friendRequests" && <div>
							<FriendRequests friendData={friendData} MessageFriend={MessageFriend} messageConversation={messageConversation} />
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
					<div className={"split right " + ((notFriend || messageConversation || messageFriend) ? "show" : "hide")} id="wrapper">
						<div className="message-outer">
							{(friendData) ? <TopBar notFriend={notFriend} MessageFriend={MessageFriend} friendData={friendData} activeUsers={activeUsers} messageConversation={messageConversation} /> : <></>}
							<ul className="force-overflow scrollbar" id="message-scroll">
								<div>
									{
										messageConversation && messageData.map((m, i) => (
											< Messages messageConversation={messageConversation} setMessageConversation={setMessageConversation} message={m} key={i} index={i} />
										))
									}
								</div>
								<li ref={(el) => { setScroll(el) }} style={{ position: "relative", display: "flex" }}></li>
							</ul>
						</div>
						{(notFriend) ?
							<NotFriends MessageFriend={MessageFriend} friendData={friendData} messageConversation={messageConversation} />
							: <>
								{(messageConversation || messageFriend) &&
									<SendInput setMessageConversation={setMessageConversation} messageConversationId={messageConversation._id} friendData={friendData} setMessageData={setMessageData} />
								}
							</>
						}
					</div>
				</div>



			</div >
		)
	} else if (Auth.getAuth() === false) {
		return (
			<div>
				{state.email === null && <Loader />}
				{state.email === false && <h3>
					You need To login First
				</h3 >}
			</div>
		)
	}

	return (
		<div>
			{state.email === null && <Loader />}
			{state.email === false && <h1>First you have to Login/Register</h1>}
		</div>
	)
}

export default Chatting
