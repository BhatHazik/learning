// import { useEffect, useMemo, useRef, useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import logo from "../../assets/istockphoto-841971598-1024x1024.jpg";
// import './Support.css'
// import { RxDotsVertical } from "react-icons/rx";
// import useFetch from "../../hooks/useFetch";
// import { BASE_URI } from "../../Config/url";
// import axios from "axios";
// import { FaUserCircle } from "react-icons/fa";

// const Support = () => {
//   const [messages, setMessages] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [popupVisible, setPopupVisible] = useState(false);
//   const popupRef = useRef(null);
//   const [activeTab, setActiveTab] = useState("allChats");
  
//   const token = localStorage.getItem("token");
//   const chatListUrl = `${BASE_URI}/api/v1/chat`;

//   const fetchOptions = {
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   };

//   const { data } = useFetch(chatListUrl, fetchOptions);
//   const chatList = useMemo(() => data?.data || [], [data]);

//   const handleOpenChat = (recieverId) => {
//     axios
//       .get(`${BASE_URI}/api/v1/chat/chatMessages/${recieverId}`, fetchOptions)
//       .then((resp) => {
//         console.log("Chat messages response:", resp.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching chat messages:", error);
//       });
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (inputValue.trim() !== "" && selectedChat !== null) {
//       const newMessage = {
//         id: messages[selectedChat].messages.length + 1,
//         text: inputValue,
//         sender: "You",
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       };
//       const updatedMessages = [...messages];
//       updatedMessages[selectedChat].messages.push(newMessage);
//       setMessages(updatedMessages);
//       setInputValue("");
//     }
//   };

//   const handleDotsClick = () => {
//     setPopupVisible(!popupVisible);
//   };

//   const handleOutsideClick = (e) => {
//     if (popupRef.current && !popupRef.current.contains(e.target)) {
//       setPopupVisible(false);
//     }
//   };

//   useEffect(() => {
//     if (popupVisible) {
//       document.addEventListener("click", handleOutsideClick);
//     } else {
//       document.removeEventListener("click", handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener("click", handleOutsideClick);
//     };
//   }, [popupVisible]);

//   return (
//     <div className="w-100">
//       <header className="bg-gradient-custom-div p-3 rounded-3">
//         <h3 className="pb-4">Support</h3>
//         <div className="d-flex gap-5 px-3 p-btm">
//           <h5
//             className={`text-white px-3 pb-2 fw-light cursor-pointer ${
//               activeTab === "allChats" ? "border-bottom border-4" : ""
//             }`}
//             onClick={() => setActiveTab("allChats")}
//           >
//             All Chats
//           </h5>
//         </div>
//       </header>

//       {activeTab === "allChats" && (
//         <main className="d-flex" style={{ minHeight: "calc(100vh - 14rem)" }}>
//           <section className="px-2 py-2 w-50 border-end pe-4">
//             <div className="input-group mb-4">
//               <input
//                 type="text"
//                 id="search"
//                 placeholder="Search User"
//                 aria-label="search"
//                 className="form-control border-end-0 px-3 bg-custom-secondary"
//               />
//               <label
//                 className="input-group-text search-icon border-start-0 bg-custom-secondary"
//                 htmlFor="search"
//               >
//                 <CiSearch />
//               </label>
//             </div>

//             <div className="px-1 py-3 chat-list">
//               {chatList.map((message) => (
//                 <div
//                   key={message.id}
//                   className="d-flex align-items-center gap-5 py-1 border-bottom cursor-pointer"
//                   onClick={() => handleOpenChat(message.id)}
//                 >
//                   <div>
//                     {message.profile_picture ? (
//                       <img
//                         src={message.profile_picture}
//                         alt=""
//                         className="rounded-circle mb-1"
//                         style={{
//                           width: "3rem",
//                           height: "3rem",
//                           objectFit: "cover",
//                         }}
//                       />
//                     ) : (
//                       <FaUserCircle className="fs-1" />
//                     )}
//                     <div className="favorite text-center">
//                       {message.is_favorite === 1 ? "⭐" : "☆"}
//                     </div>
//                   </div>
//                   <div className="message-info w-100">
//                     <div className="d-flex align-items-center justify-content-between mb-1">
//                       <h5 className="fw-light">{message.name}</h5>
//                       <p className="mb-0 fw-light">
//                         {getTimeDifference(message.updated_at)}
//                       </p>
//                     </div>
//                     <p className="fw-light">{message.message}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           <section className="w-50">
//             {selectedChat !== null ? (
//               <div className="w-100 border rounded-end shadow-sm">
//                 <header className="d-flex align-items-center p-3 border-bottom">
//                   <div className="d-flex align-items-center gap-4">
//                     <div className="favorite text-center">
//                       {messages[selectedChat].isFavorite ? "⭐" : "☆"}
//                     </div>
//                     <img
//                       src={messages[selectedChat].profileImage}
//                       alt="Profile"
//                       className="rounded-circle me-2 object-fit-cover"
//                       width="40"
//                       height="40"
//                     />
//                     <h5 className="mb-0 fw-light">
//                       {messages[selectedChat].profileName}
//                     </h5>
//                   </div>
//                   <div className="ms-auto position-relative" ref={popupRef}>
//                     <RxDotsVertical
//                       className="fs-3 cursor-pointer"
//                       onClick={handleDotsClick}
//                     />
//                     {popupVisible && (
//                       <div
//                         className="popup-menu position-absolute bg-white border rounded shadow-sm"
//                         style={{ right: "0%", top: "100%", zIndex: 10 }}
//                       >
//                         <ul
//                           className="list-unstyled m-0 text-center"
//                           style={{ minWidth: "12rem" }}
//                         >
//                           <li className="py-2 px-3 cursor-pointer text-light-custom">
//                             Remove Important
//                           </li>
//                           <li className="py-2 px-3 cursor-pointer border-top border-bottom text-light-custom">
//                             Mark as Read
//                           </li>
//                           <li className="py-2 px-3 cursor-pointer text-light-custom">
//                             Block
//                           </li>
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </header>

//                 <section
//                   className="p-3 flex-grow-1 overflow-auto h-100"
//                   style={{ minHeight: "23rem" }}
//                 >
//                   {messages[selectedChat].messages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`message ${
//                         msg.sender === "You" ? "sent" : "received"
//                       } mb-2`}
//                     >
//                       <div className="message-content p-2">
//                         <p className="text-muted mb-2">{msg.time}</p>
//                         <p className="mb-0 fw-light">{msg.text}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </section>

//                 <footer className="d-flex align-items-center">
//                   <form className="input-group" onSubmit={handleSendMessage}>
//                     <input
//                       type="text"
//                       className="form-control py-2 rounded-0"
//                       placeholder="Type a message..."
//                       value={inputValue}
//                       onChange={(e) => setInputValue(e.target.value)}
//                     />
//                     <button
//                       className="rounded-0 signup-now py-2 px-4 fw-lightBold h-auto mb-0"
//                       type="submit"
//                     >
//                       Send
//                     </button>
//                   </form>
//                 </footer>
//               </div>
//             ) : (
//               <div className="h-100 d-flex align-items-center justify-content-center">
//                 <h4 className="fw-light">Select a message to read here!</h4>
//               </div>
//             )}
//           </section>
//         </main>
//       )}
//     </div>
//   );
// };

// export default Support;



// import { useEffect, useMemo, useRef, useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import logo from "../../assets/istockphoto-841971598-1024x1024.jpg";
// import "../UserModule/Messages/Messages.css";
// import { RxDotsVertical } from "react-icons/rx";
// import useFetch from "../../hooks/useFetch";
// import { BASE_URI } from "../../Config/url";
// import axios from "axios";
// import { FaUserCircle } from "react-icons/fa";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUserCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
// import { PulseLoader } from "react-spinners";
// import { io } from "socket.io-client";
// import { socket } from "../../socket";


// const initialMessages = [
//   {
//     id: 1,
//     profileName: "John Doe",
//     profileImage: logo,
//     lastMessage: "Hey, how are you?",
//     lastMessageTime: "2024-07-31T10:30:00",
//     isFavorite: true,
//     messages: [
//       { id: 1, text: "Hello!", sender: "John Doe", time: "10:00 AM" },
//       { id: 2, text: "Hi, how are you?", sender: "You", time: "10:02 AM" },
//     ],
//   },
//   {
//     id: 2,
//     profileName: "Jane Smith",
//     profileImage: logo,
//     lastMessage: "See you tomorrow!",
//     lastMessageTime: "2024-07-31T09:45:00",
//     isFavorite: false,
//     messages: [
//       {
//         id: 1,
//         text: "See you tomorrow!",
//         sender: "Jane Smith",
//         time: "09:45 AM",
//       },
//       { id: 2, text: "Sure!", sender: "You", time: "09:46 AM" },
//     ],
//   },

//   // Add more profiles as needed
// ];

// const getTimeDifference = (date) => {
//   const now = new Date();
//   const messageDate = new Date(date);
//   const differenceInMilliseconds = now - messageDate;
//   const differenceInMinutes = Math.floor(
//     differenceInMilliseconds / (1000 * 60)
//   );
//   const differenceInHours = Math.floor(differenceInMinutes / 60);
//   const differenceInDays = Math.floor(differenceInHours / 24);

//   if (differenceInDays > 0) {
//     return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
//   } else if (differenceInHours > 0) {
//     return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
//   } else if (differenceInMinutes > 0) {
//     return `${differenceInMinutes} minute${
//       differenceInMinutes > 1 ? "s" : ""
//     } ago`;
//   } else {
//     return `Just now`;
//   }
// };

// const Support = () => {
//   const [messages, setMessages] = useState({});
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [allExpertsPopUp, setAllExpertsPopUp] = useState(false);
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [allExpertsData, setAllExpertsData] = useState(null);
//   const [allExpertsInput, setAllExpertsInput] = useState("");
//   const [selectedEmail, setSelecetedEmail] = useState(null);
//   const [allExpertsLoading, setAllExpertsLoading] = useState(false);
//   const [selectedImage, setselectedImage] = useState("")
//   const [selectedName, setSelectedName] = useState("")
//   const [allExpertsError, setAllExpertsError] = useState("");
//   const popupRef = useRef(null);
//   const userType = localStorage.getItem("userType");
//   const token = localStorage.getItem("token");
//   const chatListUrl = `${BASE_URI}/api/v1/chat/supportChat`;
//   const chatBottomRef = useRef(null);

//   const fetchOptions = {
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   };

//   const { data } = useFetch(chatListUrl, fetchOptions);
//   const chatList = useMemo(() => data?.data || [], [data]);
//   console.log(chatList);



//   const handleOpenChat = (receiverId,receiverEmail,image,name) => {
//     setselectedImage(image)
//     setSelectedName(name)
//     setAllExpertsPopUp(false)
//     setSelecetedEmail(receiverEmail);
//     setSelectedChat(receiverId);
//     console.log(receiverEmail)
//     axios
//       .get(`${BASE_URI}/api/v1/chat/chatMessages/${receiverId}`, fetchOptions)
//       .then((resp) => {
// console.log(resp?.data?.data)
//         const chatMessages = resp?.data?.data?.map((msg) => ({
//           id: msg.id,
//           text: msg.message,
//           sender: msg.sender_id === receiverId ? "Receiver" : "You",
//           time: new Date(msg.created_at).toLocaleTimeString("en-US", {
//             timeZone:"Asia/kolkata",
//             hour: "2-digit",
//             minute: "2-digit",
//           }
      
//         )
         
//         }));
//         setMessages((prevMessages) => ({
//           ...prevMessages,
//           [receiverId]: chatMessages, // Save the messages for the selected chat
//         }));

//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
  




//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!selectedChat) return;
//   // Create a new message object
//   const newMessage = {
//     id: Date.now(), // Unique ID for the message
//     text: inputValue,
//     sender: "You",
//     time: new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     }),
//   };

//   // Update the messages state without fetching data
//   setMessages((prevMessages) => ({
//     ...prevMessages,
//     [selectedChat]: [...(prevMessages[selectedChat] || []), newMessage],
//   }));

                  

//   console.log("Sending message:", inputValue);
//   console.log("sending messaage to :",selectedEmail)
  
// socket?.emit("private_message", {
//   msg: inputValue,
//   friend: selectedEmail,
// })
// , (response) => {
//   console.log('Server acknowledgment received:', response);
// };
//   setInputValue("");
// };

// useEffect(() => {
//   // Scroll to the bottom of the chat after messages update
//   chatBottomRef?.current?.scrollIntoView({ behavior: "smooth" });
// }, [messages]);


// // useEffect(() => {
// //   // Scroll to the bottom of the chat after messages update
// //   chatBottomRef?.current?.scrollIntoView({ behavior: "smooth" });
// // }, [messages]);

// // const scrollToBottom = () => {
// //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

//   // const handleDotsClick = () => {
//   //   setPopupVisible(!popupVisible);
//   // };

//   const handleOutsideClick = (e) => {
//     if (popupRef.current && !popupRef.current.contains(e.target)) {
//       setPopupVisible(false);
//     }
//   };

//   // const handleComposeClick = async (click) => {
//   //   if (click) {
//   //     setAllExpertsPopUp(true);
//   //   }

//   //   setAllExpertsLoading(true);
//   //   const url = `${BASE_URI}/api/v1/users/otherExperts${
//   //     allExpertsInput !== "" ? `?search=${allExpertsInput}` : ""
//   //   }`;
//   //   console.log(url);
//   //   await axios({
//   //     method: "GET",
//   //     url: url,
//   //     headers: {
//   //       Authorization: "Bearer " + token,
//   //     },
//   //   })
//   //     .then((res) => {
//   //       console.log(res?.data);
//   //       setAllExpertsError("");
//   //       setAllExpertsData(res?.data?.data);
//   //       setAllExpertsLoading(false);
//   //     })
//   //     .catch((err) => {
//   //       console.log(err);
//   //       setAllExpertsError(err?.response?.data?.message);
//   //       setAllExpertsLoading(false);
//   //     });
//   // };



//   // useEffect(() => {
//   //   handleComposeClick();
//   // }, [allExpertsInput]);

//   // socket.on("privateMessage",(message)=>{
//   //   console.log(message)
//   // })

  
//   useEffect(() => {
//     if (!socket || !selectedChat) return;
  
//     // Listen to socket event
//     const messageListener = (message) => {
//       console.log("received", message);
  
//       const newMessage = {
//         id: Date.now(), // Unique ID for the message
//         text: message.message,
//         sender: "Receiver",
//         time: new Date(message.date).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       };
  
//       // Update the messages state without fetching data
//       setMessages((prevMessages) => ({
//         ...prevMessages,
//         [selectedChat]: [...(prevMessages[selectedChat] || []), newMessage],
//       }));
//     };
  
//     socket.on("privateMessage", messageListener);
  
//     // Cleanup function to remove the listener
//     return () => {
//       socket.off("privateMessage", messageListener);
//     };
//   }, [socket, selectedChat]); // Add selectedChat as a dependency
  
  
  
  


//   useEffect(() => {
//     if (popupVisible) {
//       document.addEventListener("click", handleOutsideClick);
//     } else {
//       document.removeEventListener("click", handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener("click", handleOutsideClick);
//     };
//   }, [popupVisible]);

//   const getRandomColor = () => {
//     const colors = [
//       "#2C3E50", // Dark Blue-Gray
//       "#8E44AD", // Deep Purple
//       "#2980B9", // Soft Blue
//       "#16A085", // Teal
//       "#27AE60", // Green
//       "#F39C12", // Muted Orange
//       "#D35400", // Burnt Orange
//       "#C0392B", // Deep Red
//       "#BDC3C7", // Light Gray
//       "#7F8C8D", // Slate Gray
//       "#34495E", // Steel Blue
//       "#E67E22", // Warm Orange
//       "#9B59B6", // Purple
//       "#1ABC9C", // Aquamarine
//       "#3498DB", // Light Blue
//       "#95A5A6", // Cool Gray
//       "#E74C3C", // Muted Red
//       "#F1C40F", // Soft Yellow
//       "#AAB7B8", // Soft Silver
//       "#5D6D7E", // Dark Slate Blue
//     ];

//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   return (
//     <div className="w-100">
//       <header className="bg-gradient-custom-div p-3 rounded-3">
//         <h3 className="pb-4">Support</h3>
//         {/* <p className="mb-3 fs-4 fw-light">You have 0 unread messages</p> */}
//       </header>
//       <main className="d-flex" style={{ minHeight: "calc(100vh - 14rem)" }}>

//         <section className="px-2 py-2 w-40 border-end pe-4">
         

//           {/* <div className="position-relative w-100">
//             <CiSearch
//               size="1.3rem"
//               className="position-absolute search-icon text-black-50 ms-2"
//             />
//             <input
//               type="text"
//               placeholder="Search Messages"
//               className="form-control bg-custom-secondary border-end-0 px-5 py-2 rounded-2 w-100"
//             />
//           </div> */}
//           <div className="mt-3 pe-1 w-100" style={{marginBottom:"10%", height: "80%", overflowY:"auto" }}>
//           {chatList.map((chat) => (
//               <div
//                 key={chat.chat_id}
//                 className={`cursor-pointer bg-white d-flex justify-content-between p-3 mb-3 border rounded-3 ${
//                   selectedChat === chat.chat_id && "selected"
//                 }`}
//                 onClick={() => handleOpenChat(chat?.id, chat?.email, logo , "Support")}
//               >
//                 <div className="d-flex gap-2 align-items-center">
//                   <img
//                     src={chat.profile_picture || logo}
//                     alt={chat.name}
//                     className="rounded-circle"
//                     style={{ width: "50px", height: "50px" }}
//                   />
//                   <div>
//                     <h6 className="mb-0">{chat.name}</h6>
//                     <p className="text-muted mb-0">{chat.message}</p>
//                   </div>
//                 </div>
//                 <div className="d-flex flex-column justify-content-between">
//                   <small>{getTimeDifference(chat.updated_at)}</small>{" "}
//                   {/* Use the time difference here */}
//                 </div>
//                 {chat.is_read ? 0 : 1}
//               </div>
//             ))}
//           </div>
//         </section>
//         <section className="px-4 py-2 w-60 flex-grow-1" style={{height:"80%"}}>
//         <div style={{height:"3rem", display:"flex", alignItems:"center",paddingLeft:"1rem", gap:"1rem"}}>
         
//          {
         
//          selectedImage ? (
//                    <img
//                    src={selectedImage}
//                    alt={selectedName}
//                    className="rounded-circle"
//                    style={{ width: "40px", height: "40px", objectFit:"cover" }}
//                  />
//                  ) : (
//                   (selectedImage !== "" && selectedName !== "") ?
//                    <div
//                      style={{
//                        width: "30px",
//                        height: "30px",
//                        borderRadius: "50%",
//                        backgroundColor: getRandomColor(), // Function to get a random color
//                        display: "flex",
//                        alignItems: "center",
//                        justifyContent: "center",
//                      }}
//                    >
//                      <span
//                        style={{ color: "#fff", fontWeight: "bold" }}
//                      >
//                        {selectedName.charAt(0).toUpperCase()}{" "}
//                        {/* Display first letter */}
//                      </span>
//                    </div> : <></>
//                  )}
//          <p>{selectedName}</p>
//  </div>
//           {selectedChat === null ? (
//             <div className="d-flex justify-content-center align-items-center h-100">
//               <p>Select a conversation to start messaging</p>
//             </div>
//           ) : (
//             <div className="d-flex flex-column justify-content-between" style={{height:"55vh", overflowY:"auto"}}>
//               <div className="d-flex flex-column">
//   {messages[selectedChat]?.map((msg, index) => (
//     <div
//     key={index}
//     className={`d-flex ${
//       msg?.sender === "You" ? "justify-content-end" : "justify-content-start"
//     }`}
//   >
//     <div className="message-container">
//       <p className="mb-0">{msg.text}</p>
//       <small className="text-muted">{msg.time}</small>
//     </div>
//   </div>
  
//   ))}
// </div>
// <div ref={chatBottomRef}/>
//               <form onSubmit={handleSendMessage} style={{bottom:"1%", right:"10%"}} className="d-flex position-fixed">
//                 <input
//                   type="text"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   className="form-control me-2"
//                   placeholder="Type your message"
//                 />
//                 <button type="submit" className="btn btn-primary">
//                   Send
//                 </button>
//               </form>
              
            
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Support;



import { useEffect, useMemo, useRef, useState } from "react";
import { CiHeart, CiSearch } from "react-icons/ci";
import logo from "../../assets/istockphoto-841971598-1024x1024.jpg";
import { RxDotsVertical } from "react-icons/rx";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { PulseLoader } from "react-spinners";
import { io } from "socket.io-client";
import { socket } from "../../socket";





const getTimeDifference = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const differenceInMilliseconds = now - messageDate;
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInDays > 0) {
    return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
  } else if (differenceInHours > 0) {
    return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
  } else if (differenceInMinutes > 0) {
    return `${differenceInMinutes} minute${
      differenceInMinutes > 1 ? "s" : ""
    } ago`;
  } else {
    return `Just now`;
  }
};

const Support = () => {
  const [messages, setMessages] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [allExpertsPopUp, setAllExpertsPopUp] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [allExpertsData, setAllExpertsData] = useState(null);
  const [allExpertsInput, setAllExpertsInput] = useState("");
  const [selectedEmail, setSelecetedEmail] = useState(null);
  const [allExpertsLoading, setAllExpertsLoading] = useState(false);
  const [allExpertsError, setAllExpertsError] = useState("");
  const [selectedImage, setselectedImage] = useState("")
  const [selectedName, setSelectedName] = useState("")
  const [searchChat, setSearchChat] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  // const [hearted , setHearted] = useState({})

  const popupRef = useRef(null);
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");
  const chatListUrl =`${BASE_URI}/api/v1/chat/supportChat${searchChat && `?search=${searchChat}`}`;
  const chatBottomRef = useRef(null);
  const chatBottom1Ref = useRef(null);
  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data,refetch } = useFetch(chatListUrl, fetchOptions);
  const chatList = useMemo(() => data?.data || [], [data]);


const handleOpenChat = (receiverId, receiverEmail, image, name) => {
  setselectedImage(image);
  setSelectedName(name);
  setAllExpertsPopUp(false);
  setSelecetedEmail(receiverEmail);
  setSelectedChat(receiverId);
  setIsChatOpen(true);

  
  axios
    .get(`${BASE_URI}/api/v1/chat/supportChat/${receiverId}`, fetchOptions)
    .then((resp) => {
      // Map the response data to the desired format
      const chatMessages = resp?.data?.data?.map((msg) => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender_id === receiverId ? "Receiver" : "You",
        time: new Date(msg.created_at).toLocaleTimeString("en-US", {
          timeZone: "Asia/kolkata",
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date(msg.created_at).getTime(), // Add a timestamp for sorting
      }));

      // Sort messages based on the timestamp
      const sortedMessages = chatMessages.sort((a, b) => a.timestamp - b.timestamp);

      // Update the messages state with sorted messages
      setMessages((prevMessages) => ({
        ...prevMessages,
        [receiverId]: sortedMessages, // Save the sorted messages for the selected chat
      }));
    })
    .catch((err) => {
    });
};
  




  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!selectedChat) return;
  // Create a new message object
  const newMessage = {
    id: Date.now(), // Unique ID for the message
    text: inputValue,
    sender: "You",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // Update the messages state without fetching data
  setMessages((prevMessages) => ({
    ...prevMessages,
    [selectedChat]: [...(prevMessages[selectedChat] || []), newMessage],
  }));

                  

  
socket?.emit("support_message", {
  msg: inputValue,
  friend: selectedEmail,
})
, (response) => {

};
  setInputValue("");
};

useEffect(() => {
  // Scroll to the bottom of the chat after messages update
  chatBottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  chatBottom1Ref.current?.scrollIntoView({ behavior: "smooth" });

}, [messages]);



  

  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setPopupVisible(false);
    }
  };

  const handleComposeClick = async (click) => {
    if (click) {
      setAllExpertsPopUp(true);
    }

    setAllExpertsLoading(true);
    const url = `${BASE_URI}/api/v1/users/otherExperts${
      allExpertsInput !== "" ? `?search=${allExpertsInput}` : ""
    }`;

    await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
      
        setAllExpertsError("");
        setAllExpertsData(res?.data?.data);
        setAllExpertsLoading(false);
      })
      .catch((err) => {
       
        setAllExpertsError(err?.response?.data?.message);
        setAllExpertsLoading(false);
      });
  };



  useEffect(() => {
    handleComposeClick();
  }, [allExpertsInput]);

  

  useEffect(() => {
    if (!socket || !selectedChat) return;
  
    // Listen to socket event
    const messageListener = (message) => {
   
  
      const newMessage = {
        id: Date.now(), // Unique ID for the message
        text: message.message,
        sender: "Receiver",
        time: new Date(message.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      };
  
      // Update the messages state without fetching data
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedChat]: [...(prevMessages[selectedChat] || []), newMessage],
      }));
    };
  
    socket.on("supportMessage", messageListener);
  
    // Cleanup function to remove the listener
    return () => {
      socket.off("privateMessage", messageListener);
    };
  }, [socket, selectedChat]); // Add selectedChat as a dependency
  
  
  
    

  useEffect(() => {
    if (popupVisible) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [popupVisible]);

  const getRandomColor = () => {
    const colors = [
      "#2C3E50", // Dark Blue-Gray
      "#8E44AD", // Deep Purple
      "#2980B9", // Soft Blue
      "#16A085", // Teal
      "#27AE60", // Green
      "#F39C12", // Muted Orange
      "#D35400", // Burnt Orange
      "#C0392B", // Deep Red
      "#BDC3C7", // Light Gray
      "#7F8C8D", // Slate Gray
      "#34495E", // Steel Blue
      "#E67E22", // Warm Orange
      "#9B59B6", // Purple
      "#1ABC9C", // Aquamarine
      "#3498DB", // Light Blue
      "#95A5A6", // Cool Gray
      "#E74C3C", // Muted Red
      "#F1C40F", // Soft Yellow
      "#AAB7B8", // Soft Silver
      "#5D6D7E", // Dark Slate Blue
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-100 position-relative">
      <header className="bg-gradient-custom-div p-3 rounded-3">
        <h3 className="pb-4">Support</h3>
        {/* <p className="mb-3 fs-4 fw-light">You have 0 unread messages</p> */}
      </header>
      <main className="d-flex" style={{ minHeight: "calc(100vh - 14rem)" }}>

        <section className="chatlist-messages px-2 py-2 border-end pe-4 position-relative">



          <div
            className="d-flex align-items-center gap-5 mb-3"
           
          >





            <div className="position-relative w-50">
             
            </div>
          </div>
         {userType === "admin" && <div className="position-relative w-100">
            <CiSearch
              size="1.3rem"
              className="position-absolute search-icon text-black-50 ms-2"
            />
            <input
              type="text"
              placeholder="Search Messages"
              value={searchChat}
              onChange={(e)=> setSearchChat(e.target.value)}
              className="form-control bg-custom-secondary border-end-0 px-5 py-2 rounded-2 w-100"
            />
          </div>}
          <div className="mt-3 pe-1 w-100" style={{marginBottom:"10%", height: "80%", overflowY:"auto" }}>
            {
            chatList.length === 0 ? <div className="w-100 h-20 d-flex justify-content-center mt-1 custom-box bg-gradient-custom-div align-items-center"><p>No users found!</p></div>:
            chatList?.map((chat) => (
              <div
                key={chat?.chat_id}
                className={`cursor-pointer bg-white d-flex justify-content-between p-3 mb-3 border rounded-3 ${
                  selectedChat === chat.chat_id && "selected"
                }`}


                onClick={() => userType !== "admin" ? userType === "expert" ? handleOpenChat(chat?.user_id, chat?.email, logo, "Support") : handleOpenChat(chat?.id, chat?.email, logo, "Support") :  handleOpenChat(chat?.user_id,chat?.email, chat?.profile_picture, chat?.name)}
              >
                <div className="d-flex gap-2 align-items-center">
                  <img
                    src={chat.profile_picture || logo}
                    alt={chat.name}
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" , objectFit:"cover"}}
                  />
                  <div>
                    <h6 className="mb-0">{userType !== "admin" ? "Support": chat.name}</h6>
                    <p style={{fontWeight:chat?.is_read ? "600":"normal"}} className={`text-muted mb-0 `}>{chat?.message ? chat?.message?.slice(0, 15) + "...": ""}</p>
                  </div>
                </div>
                <div className="d-flex flex-column justify-content-between">
                  <small>{getTimeDifference(chat.updated_at)}</small>{" "}
                  {/* {hearted[chat.expert_id] ? ( // Check if the specific chat is hearted
  <FontAwesomeIcon
    onClick={(e) => handleFavoriteToggle(e, chat.expert_id)}
    id="heart-messages"
    icon={faHeart}
    style={{ zIndex: "10", color: "red" }} // Add color for the hearted state
  />
) : (
  <CiHeart
    style={{ zIndex: "10", color: "black" }} // Default color for unhearted state
    onClick={(e) => handleFavoriteToggle(e, chat.expert_id)}
    id="unHeart-messages"
  />
)} */}
                  {/* Use the time difference here */}
                </div>
                
              </div>
            ))}
          </div>
        </section>
        <section className={`responsive-support-full position-absolute bg-white px-4 py-2 w-100 flex-grow-1 ${isChatOpen ? 'slide-in' : 'slide-out'}`} style={{}}>
          <div style={{ height: "3rem", display: "flex", alignItems: "center", gap: "1rem" }}>
<FontAwesomeIcon onClick={()=>setIsChatOpen(false)} icon={faArrowLeft}/>
            {

              selectedImage ? (
                <img
                  src={selectedImage}
                  alt={selectedName}
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              ) : (
                (selectedImage !== "" && selectedName !== "") ?
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: getRandomColor(), // Function to get a random color
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{ color: "#fff", fontWeight: "bold" }}
                    >
                      {selectedName.charAt(0).toUpperCase()}{" "}
                      {/* Display first letter */}
                    </span>
                  </div> : <></>
              )}
            <p>{selectedName}</p>
          </div>
          {selectedChat === null ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p>Select a conversation to start yoyo</p>
            </div>
          ) : (
            <div className="messages-long-messages d-flex flex-column justify-content-between" style={{ overflowY: "auto" }}>
              <div className="d-flex flex-column">
                {messages[selectedChat]?.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex ${msg?.sender === "You" ? "justify-content-end" : "justify-content-start"
                      }`}
                  >
                    <div className="message-container">
                      <p className="mb-0">{msg.text}</p>
                      <small className="text-muted">{msg.time}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={chatBottomRef} />
              <form className="sendmessagesinput d-flex position-fixed">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="form-control me-2"
                  placeholder="Type your message"
                />
                <button disabled={inputValue === "" ? true : false} onClick={handleSendMessage} className="btn btn-primary">
                  Send
                </button>
              </form>
            </div>
          )}
        </section>
        <section className="responsive-messages-short px-4 py-2 w-60 flex-grow-1" style={{height:"80%"}}>
          <div style={{height:"3rem", display:"flex", alignItems:"center",paddingLeft:"1rem", gap:"1rem"}}>
         
                  {
                  
                  selectedImage ? (
                            <img
                            src={selectedImage}
                            alt={selectedName}
                            className="rounded-circle"
                            style={{ width: "40px", height: "40px", objectFit:"cover" }}
                          />
                          ) : (
                           (selectedImage !== "" && selectedName !== "") ?
                            <div
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: getRandomColor(), // Function to get a random color
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{ color: "#fff", fontWeight: "bold" }}
                              >
                                {selectedName?.charAt(0)?.toUpperCase()}{" "}
                                {/* Display first letter */}
                              </span>
                            </div> : <></>
                          )}
                  <p>{selectedName}</p>
          </div>
          {selectedChat === null ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p>Select a conversation to start messaging</p>
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-between" style={{height:"55vh", overflowY:"auto"}}>
              <div className="d-flex flex-column">
  {messages[selectedChat]?.map((msg, index) => (
    <div
    key={index}
    className={`d-flex ${
      msg?.sender === "You" ? "justify-content-end" : "justify-content-start"
    }`}
  >
    <div className="message-container">
      <p className="mb-0">{msg.text}</p>
      <small className="text-muted">{msg.time}</small>
    </div>
  </div>
  
  ))}
</div>
<div ref={chatBottomRef}/>
              <form onSubmit={handleSendMessage} style={{bottom:"1%", right:"10%"}} className="d-flex position-fixed">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="form-control me-2"
                  placeholder="Type your message"
                />
                <button disabled={inputValue === "" ? true: false} type="submit" className="btn btn-primary">
                  Send
                </button>
              </form>
              
            
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Support;

