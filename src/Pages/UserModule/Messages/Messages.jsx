import { useEffect, useMemo, useRef, useState } from "react";
import { CiHeart, CiSearch } from "react-icons/ci";
import logo from "../../../assets/istockphoto-841971598-1024x1024.jpg";
import "./Messages.css";
import { RxDotsVertical } from "react-icons/rx";
import useFetch from "../../../hooks/useFetch";
import { BASE_URI } from "../../../Config/url";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHeart, faUserCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { PulseLoader } from "react-spinners";
import { socket } from "../../../socket";
import toast from "react-hot-toast";



const initialMessages = [
  {
    id: 1,
    profileName: "John Doe",
    profileImage: logo,
    lastMessage: "Hey, how are you?",
    lastMessageTime: "2024-07-31T10:30:00",
    isFavorite: true,
    messages: [
      { id: 1, text: "Hello!", sender: "John Doe", time: "10:00 AM" },
      { id: 2, text: "Hi, how are you?", sender: "You", time: "10:02 AM" },
    ],
  },
  {
    id: 2,
    profileName: "Jane Smith",
    profileImage: logo,
    lastMessage: "See you tomorrow!",
    lastMessageTime: "2024-07-31T09:45:00",
    isFavorite: false,
    messages: [
      {
        id: 1,
        text: "See you tomorrow!",
        sender: "Jane Smith",
        time: "09:45 AM",
      },
      { id: 2, text: "Sure!", sender: "You", time: "09:46 AM" },
    ],
  },

  // Add more profiles as needed
];

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
    return `${differenceInMinutes} minute${differenceInMinutes > 1 ? "s" : ""
      } ago`;
  } else {
    return `Just now`;
  }
};

const Messages = () => {
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
  const [hearted, setHearted] = useState({})
  const [isChatOpen, setIsChatOpen] = useState(false);


  const popupRef = useRef(null);
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");
  const chatListUrl = `${BASE_URI}/api/v1/chat${searchChat && `?search=${searchChat}`}`;
  const chatBottomRef = useRef(null);
  const chatBottom1Ref = useRef(null);
  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data, refetch } = useFetch(chatListUrl, fetchOptions);
  const chatList = useMemo(() => data?.data || [], [data]);

  useEffect(() => {
    if (chatList.length > 0) {
      const initialHearted = {};
      chatList.forEach(chat => {
        initialHearted[chat?.expert_id] = chat?.is_favorite || false; // Set default to false if undefined
      });
      setHearted(initialHearted);
    }
  }, [chatList]);

  // const time = new Date(Date.now()).toLocaleTimeString(
  // )

  const handleOpenChat = (receiverId, receiverEmail, image, name) => {
    setselectedImage(image);
    setSelectedName(name);
    setAllExpertsPopUp(false);
    setSelecetedEmail(receiverEmail);
    setSelectedChat(receiverId);
    setIsChatOpen(true);

    axios
      .get(`${BASE_URI}/api/v1/chat/chatMessages/${receiverId}`, fetchOptions)
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
    if (!selectedChat || selectedChat === "") return;
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




    socket?.emit("private_message", {
      msg: inputValue,
      friend: selectedEmail,
    })
      , (response) => {
  
      };
    setInputValue("");
  };

  useEffect(() => {

        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        chatBottom1Ref.current?.scrollIntoView({ behavior: "smooth" });
      // }, 100); // Delay to allow DOM to update
    // }
  }, [messages, selectedChat]);




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
    const url = `${BASE_URI}/api/v1/users/otherExperts${allExpertsInput !== "" ? `?search=${allExpertsInput}` : ""
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

    socket.on("privateMessage", messageListener);

    // Cleanup function to remove the listener
    return () => {
      socket.off("privateMessage", messageListener);
    };
  }, [socket, selectedChat]); // Add selectedChat as a dependency








  const addToFavorites = async (e, receiverId) => {
    e.stopPropagation();
    if (!token) {
      navigate("/");
    }
    setHearted((prev) => ({
      ...prev,
      [receiverId]: true, // Set to true as it's now a favorite
    }));
    try {
      await axios({
        method: "post",
        url: `${BASE_URI}/api/v1/chat`,
        data: { receiver: receiverId },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // Update the hearted state

      toast.success("Added to favorites");
    } catch (err) {

      toast.error("Failed to add to favorites");
    }
  };

  const removeFromFavorites = async (e, receiverId) => {
    e.stopPropagation();
    if (!token) {
      navigate("/");
    }
    // Update the hearted state
    setHearted((prev) => ({
      ...prev,
      [receiverId]: false, // Set to false as it's no longer a favorite
    }));
    try {
      await axios({
        method: "delete",
        url: `${BASE_URI}/api/v1/chat`,
        data: { receiver: receiverId },
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success("Removed from favorites");
    } catch (err) {
   
      toast.error("Failed to remove from favorites");
    }
  };

  const handleFavoriteToggle = (e, receiverId) => {
    e.stopPropagation();
    const isCurrentlyHearted = hearted[receiverId];
    if (isCurrentlyHearted) {
      removeFromFavorites(e, receiverId);
    } else {
      addToFavorites(e, receiverId);
    }
  };

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
        <h3 className="pb-4">Messages</h3>
        <p className="mb-3 fs-4 fw-light">Messages from {userType === "expert" ? "users" : "experts"}</p>
      </header>
      <main className="d-flex" style={{ minHeight: "calc(100vh - 14rem)" }}>

        <section className="chatlist-messages px-2 py-2 pe-4 position-relative">



          <div
            className="d-flex align-items-center gap-5 mb-3"

          >



            <div
              name=""
              id=""
              className="p-2 bg-custom-secondary rounded-2 w-50 border-0"
            >
              <p>All Messages</p>

            </div>

            <div className="position-relative w-50">
              {userType === "user" && <button

                onClick={() => handleComposeClick("click")}
                className=" signup-now py-2 px-3 fw-lightBold mb-0 h-auto  "

              >
                Compose
              </button>}
              {allExpertsPopUp && (
                <div
                  

                  className="compose-popup position-absolute bg-white p-3 rounded"

                >
                  <span className="flex justify-content-between pb-1 align-items-center">
                    <p style={{ marginLeft: "30%" }}>All Experts</p>
                    <FontAwesomeIcon
                      onClick={() => setAllExpertsPopUp(false)}
                      className="cursor-pointer"
                      icon={faXmark}
                    />
                  </span>

                  <input
                    type="text"
                    id="search"
                    placeholder="Search here..."
                    aria-label="search"

                    className=" form-control border-end-0 px-3 bg-custom-secondary"

                    onChange={(e) => setAllExpertsInput(e.target.value)}
                  />
                  <div
                    style={{
                      height: "70%",
                      scrollbarWidth: "none",
                      overflowX: "hidden",
                    }}
                    className="flex flex-column position-relative"
                  >
                    {allExpertsLoading ? (
                      <PulseLoader
                        size={8}
                        style={{ top: "40%", left: "45%" }}
                        color="black"

                        className="position-absolute "
                      />
                    ) : allExpertsError === "No expert found" ? (
                      <p
                        style={{
                          top: "40%",
                          left: "25%",
                          whiteSpace: "nowrap",
                        }}
                        className="position-absolute "
                      >
                        {allExpertsError}
                      </p>
                    ) : (
                      allExpertsData?.map((profile, index) => (
                        <span
                          key={index}
                          onClick={() => handleOpenChat(profile?.id, profile?.email, profile?.profile_picture, profile?.name)}

                          className="d-flex gap-2 align-items-center m-2 cursor-pointer bg-blue"
                        >
                          {profile.profile_picture ? (
                            <img
                              src={profile.profile_picture}
                              alt={profile.name}
                              className="rounded-circle"
                              width="30"
                              height="30"
                            />
                          ) : (
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
                                {profile.name.charAt(0).toUpperCase()}{" "}
                                {/* Display first letter */}
                              </span>
                            </div>
                          )}
                          <p className="fs-6">{profile.name}</p>
                        </span>
                      ))

                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="position-relative w-100">
            <CiSearch
              size="1.3rem"
              className="position-absolute search-icon text-black-50 ms-2"
            />
            <input
              type="text"
              placeholder="Search Messages"
              value={searchChat}
              onChange={(e) => setSearchChat(e.target.value)}
              className="form-control bg-custom-secondary border-end-0 px-5 py-2 rounded-2 w-100"
            />
          </div>
          <div className="mt-3 pe-1 w-100" style={{ marginBottom: "10%", height: "80%", overflowY: "auto" }}>
            {
              chatList.length === 0 ? <div className="w-100 h-20 d-flex justify-content-center mt-1 custom-box bg-gradient-custom-div align-items-center"><p>No users found!</p></div> :
                chatList.map((chat) => (
                  <div
                    key={chat.chat_id}
                    className={`cursor-pointer bg-white d-flex justify-content-between p-3 mb-3 border rounded-3 ${selectedChat === chat.chat_id && "selected"
                      }`}
                    onClick={() => handleOpenChat(chat?.expert_id, chat?.email, chat?.profile_picture, chat?.name)}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      
                      {/* <img
                        src={chat.profile_picture || logo}
                        alt={chat.name}
                        className="rounded-circle"
                        style={{ width: "50px", height: "50px" }}
                      /> */}
                      {chat.profile_picture ? (
                            <img
                              src={chat.profile_picture}
                              alt={chat.name}
                              className="rounded-circle"
                              width="30"
                              height="30"
                            />
                          ) : (
                            <div
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "50%",
                                backgroundColor: getRandomColor(), // Function to get a random color
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >  <span
                            style={{ color: "#fff", fontWeight: "bold" }}
                          >
                            {chat.name.charAt(0).toUpperCase()}{" "}
                            {/* Display first letter */}
                          </span></div>)}
                      <div>
                        <h6 className="mb-0">{chat.name}</h6>
                        <p style={{ fontWeight: chat?.is_read ? "600" : "normal" }} className={`text-muted mb-0 `}>{chat?.message ? chat?.message?.slice(0, 15) + "..." : ""}</p>
                      </div>
                    </div>
                    <div className="d-flex flex-column justify-content-between">
                      <small>{getTimeDifference(chat.updated_at)}</small>{" "}
                      {hearted[chat.expert_id] ? ( // Check if the specific chat is hearted
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
                      )}
                      {/* Use the time difference here */}
                    </div>

                  </div>
                ))}
          </div>
        </section>
        <section className="responsive-messages-short px-4 py-2 w-60 flex-grow-1" style={{ height: "80%"}}>
          <div style={{ height: "3rem", display: "flex", alignItems: "center", paddingLeft: "1rem", gap: "1rem" }}>

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
              <p>Select a conversation to start messaging</p>
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-between" style={{ height: "55vh", overflowY: "auto" }}>
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
              <div ref={chatBottom1Ref} />
              <form style={{ bottom: "1%", right: "10%" }} className="d-flex position-fixed">
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


        <section className={`responsive-messages-full position-absolute bg-white px-4 py-2 w-100 flex-grow-1 ${isChatOpen ? 'slide-in' : 'slide-out'}`} style={{}}>
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
      </main>
    </div>
  );
};

export default Messages;
