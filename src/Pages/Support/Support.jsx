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
import { IoIosSend } from "react-icons/io";
import Popup from "../../Components/PopUp/PopUp";
import defaultUser from "../../assets/defaultUser.svg";





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
  const inputRef = useRef(null);
  const popupRef = useRef(null);
  // const [hearted , setHearted] = useState({})

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
  console.log(chatList);

const handleOpenChat = (receiverId, receiverEmail, image, name) => {
  setselectedImage(image);
  setSelectedName(name);
  setAllExpertsPopUp(false);
  setSelecetedEmail(receiverEmail);
  setSelectedChat(receiverId);
  setIsChatOpen(true);

  console.log(receiverId, receiverEmail, image, name)
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
      id: Date.now(),
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
    });

    setInputValue("");
    
    // Keep focus on the input field to prevent keyboard from closing on mobile
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
  
    const messageListener = (message) => {
      const newMessage = {
        id: Date.now(), // Unique ID for the message
        text: message.message,
        sender: "Receiver",
        time: new Date(message.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMessage],
      }));
    };
  
    socket.on('supportMessage', messageListener);
  
    return () => {
      socket.off('supportMessage', messageListener);
    };
  }, [socket, selectedChat]);

  
    

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
    <>
    <div className="w-100 position-relative wrapper-experts">
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


                onClick={() => userType !== "admin" ? userType === "expert" ? handleOpenChat(chat?.user_id, chat?.email, logo, "Support") : handleOpenChat(chat?.user_id, chat?.email, logo, "Support") :  handleOpenChat(chat?.user_id,chat?.email, chat?.profile_picture, chat?.name)}
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
              <form onSubmit={handleSendMessage} className="d-flex mt-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="form-control me-2"
                  placeholder="Type your message"
                  ref={inputRef}
                />
                <button
                  type="submit"
                  disabled={inputValue === ""}
                  className="btn btn-primary"
                >
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
              <form 
                className="d-flex fixed-bottom p-3 py-3 app-black"
                style={{ borderTop: "1px solid #ddd" }}
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  value={inputValue}
                  placeholder="Enter your message"
                  onChange={(e) => setInputValue(e.target.value)}
                  className="modern-input form-control me-2"
                  ref={inputRef}
                />
                <button
                  type="submit"
                  disabled={inputValue === ""}
                  className="app-red rounded-1 border-0 px-4 app-text-white"
                >
                  <IoIosSend className="fs-5"/>
                </button>
              </form>
              
            
            </div>
          )}
        </section>
      </main>
    </div>

    <div className="container-fluid p-0 mobile-experts w-100">
  <main className="row m-0 w-100" style={{ minHeight: "calc(100vh - 14rem)" }}>
    {/* Chat List Section */}
    <section className="chatlist-messages p-0 col-12 col-md-4 d-flex flex-column align-items-center w-100 position-relative">
      <div className="d-flex align-items-center gap-3 mb-2 app-white px-2 py-2 mt-2 w-100">
        <div className="p-2 rounded-2 border-0 flex-grow-1">
          <p className="mb-0 fw-semibold fs-5">Messages</p>
        </div>
        {userType === "user" && (
          <div className="position-relative">
            <button
              onClick={() => handleComposeClick("click")}
              className="app-black app-text-white rounded-1 border-0 py-2 px-3 fw-bold mb-0"
            >
              Compose
            </button>
            <Popup
              isOpen={allExpertsPopUp}
              onClose={() => setAllExpertsPopUp(false)}
              title={"All experts"}
            >
              <input
                type="text"
                id="search"
                placeholder="Search here..."
                aria-label="search"
                className="form-control border-end-0 px-3 bg-custom-secondary"
                onChange={(e) => setAllExpertsInput(e.target.value)}
              />
              <div className="mt-2" style={{ height: "200px", overflowY: "auto" }}>
                {allExpertsLoading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <PulseLoader size={8} color="black" />
                  </div>
                ) : allExpertsError === "No expert found" ? (
                  <p className="text-center mt-2">{allExpertsError}</p>
                ) : (
                  allExpertsData?.map((profile, index) => (
                    <span
                      key={index}
                      onClick={() =>
                        handleOpenChat(
                          profile?.id,
                          profile?.email,
                          profile?.profile_picture,
                          profile?.name
                        )
                      }
                      className="d-flex gap-2 align-items-center m-2 cursor-pointer bg-blue p-1 rounded"
                    >
                      {profile.profile_picture ? (
                        <img
                          src={profile.profile_picture}
                          alt={profile.name}
                          className="rounded-circle"
                          width="30"
                          height="30"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultUser;
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            backgroundColor: getRandomColor(),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ color: "#fff", fontWeight: "bold" }}>
                            {profile.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <p className="fs-6 mb-0">{profile.name}</p>
                    </span>
                  ))
                )}
              </div>
            </Popup>
          </div>
        )}
      </div>
      <div
        style={{ width: "95%", height: "max-content" }}
        className="search-input input-group mt-2 mb-2"
      >
        <div
          className="w-100"
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            lineHeight: "28px",
            height: "max-content",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "1rem",
              fill: "#9e9ea7",
              width: "1rem",
              height: "1rem",
            }}
          >
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
            </g>
          </svg>
          <input
            type="search"
            placeholder="Search Messages"
            value={searchChat}
            onChange={(e) => setSearchChat(e.target.value)}
            style={{
              width: "100%",
              height: "45px",
              lineHeight: "28px",
              border: "2px solid transparent",
              padding: "0 1rem",
              paddingLeft: "2.5rem",
              borderRadius: "8px",
              outline: "none",
              backgroundColor: "#fff",
              color: "#0d0c22",
              transition: "0.3s ease",
              boxShadow: "-1px 3px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
      </div>
      <div
        className="chat-list-container px-2 w-100"
        style={{ height: "calc(100vh - 20rem)", overflowY: "auto" }}
      >
        {chatList.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <p>No users found!</p>
          </div>
        ) : (
          chatList.map((chat) =>  (
            <div
              key={chat.chat_id}
              className={`cursor-pointer bg-white d-flex justify-content-between p-3 mb-2 border rounded-3 ${
                selectedChat === chat.chat_id ? "selected" : ""
              }`}
              onClick={() =>
                handleOpenChat(
                  chat?.user_id,
                  chat?.email,
                  chat?.profile_picture,
                  chat?.name
                )
              }
            >
              <div className="d-flex gap-2 align-items-center">
                {chat.profile_picture ? (
                  <img
                    src={chat.profile_picture}
                    alt={chat.name}
                    className="rounded-circle"
                    width="30"
                    height="30"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultUser;
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      backgroundColor: getRandomColor(),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "#fff", fontWeight: "bold" }}>
                      {chat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h6 className="mb-0">{chat.name}</h6>
                  <p
                    style={{ fontWeight: chat?.is_read ? "600" : "normal" }}
                    className="text-muted mb-0"
                  >
                    {chat?.message ? chat?.message.slice(0, 15) + "..." : ""}
                  </p>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between">
                <small>{getTimeDifference(chat.updated_at)}</small>
                {/* {hearted[chat.expert_id] ? (
                  <FontAwesomeIcon
                    onClick={(e) => handleFavoriteToggle(e, chat.expert_id)}
                    icon={faHeart}
                    id="heart-messages"
                    style={{ zIndex: "10", color: "red" }}
                  />
                ) : (
                  <CiHeart
                    style={{ zIndex: "10", color: "black" }}
                    id="unHeart-messages"
                    onClick={(e) => handleFavoriteToggle(e, chat.expert_id)}
                  />
                )} */}
              </div>
            </div>
          ))
        )}
      </div>
    </section>

    {/* Desktop Chat Messages Section */}
    <section
      className="chat-messages-area d-none d-md-flex flex-column col-md-8 p-2 position-relative"
      style={{ borderLeft: "1px solid #ddd" }}
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={selectedName}
            className="rounded-circle"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultUser;
            }}
          />
        ) : (
          selectedImage !== "" &&
          selectedName !== "" && (
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: getRandomColor(),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: "bold" }}>
                {selectedName.charAt(0).toUpperCase()}
              </span>
            </div>
          )
        )}
        <p className="mb-0">{selectedName}</p>
      </div>
      {selectedChat === null ? (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <p>Select a conversation to start messaging</p>
        </div>
      ) : (
        <div
          className="d-flex flex-column justify-content-between"
          style={{ height: "calc(100vh - 20rem)", overflowY: "auto"}}
        >
          <div className="message-list">
            {messages[selectedChat]?.map((msg, index) => (
              <div
                key={index}
                className={`d-flex ${
                  msg?.sender === "You" ? "justify-content-end" : "justify-content-start"
                }`}
              >
                <div className="message-container p-2 mb-2 bg-light rounded">
                  <p className="mb-0">{msg.text}</p>
                  <small className="text-muted">{msg.time}</small>
                </div>
              </div>
            ))}
          </div>
          <div ref={chatBottom1Ref} />
          <form onSubmit={handleSendMessage} className="d-flex mt-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="form-control me-2"
              placeholder="Type your message"
              ref={inputRef}
            />
            <button
              type="submit"
              disabled={inputValue === ""}
              className="btn btn-primary"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </section>

    {/* Mobile Chat Messages Section */}
    <section
      className={`mobile-chat d-md-none ${isChatOpen ? "d-block" : "d-none"} position-fixed top-0 start-0 w-100 h-100 bg-white p-3`}
      style={{ zIndex: 1050 }}
    >
      <div className="d-flex gap-2 mb-3 w-100 align-items-center">
        <FontAwesomeIcon
          onClick={() => setIsChatOpen(false)}
          icon={faArrowLeft}
          className="cursor-pointer fs-3"
        />
        <div className="d-flex w-100 ps-3 pt-2 align-items-center gap-2 p-2 app-text-white rounded-2 app-black">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={selectedName}
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultUser;
              }}
            />
          ) : (
            selectedImage !== "" &&
            selectedName !== "" && (
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: getRandomColor(),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  {selectedName.charAt(0).toUpperCase()}
                </span>
              </div>
            )
          )}
          <p className="mb-0">{selectedName}</p>
        </div>
      </div>
      {selectedChat === null ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <p>Select a conversation to start messaging</p>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-between" style={{ height: "calc(100vh - 10rem)", overflowY: "auto" , paddingBottom:"55px"}}>
          <div className="message-list">
            {messages[selectedChat]?.map((msg, index) => (
              <div
                key={index}
                className={`d-flex ${
                  msg?.sender === "You" ? "justify-content-end" : "justify-content-start"
                }`}
              >
                <div className="message-container p-2 mb-2 bg-light rounded">
                  <p className="mb-0">{msg.text}</p>
                  <small className="text-muted">{msg.time}</small>
                </div>
              </div>
            ))}
          </div>
          <div ref={chatBottomRef} />
          <form 
            className="d-flex fixed-bottom p-3 py-3 app-black"
            style={{ borderTop: "1px solid #ddd" }}
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              value={inputValue}
              placeholder="Enter your message"
              onChange={(e) => setInputValue(e.target.value)}
              className="modern-input form-control me-2"
              ref={inputRef}
            />
            <button
              type="submit"
              disabled={inputValue === ""}
              className="app-red rounded-1 border-0 px-4 app-text-white"
            >
              <IoIosSend className="fs-5"/>
            </button>
          </form>
        </div>
      )}
    </section>
  </main>
</div>

    </>
  );
};

export default Support;

