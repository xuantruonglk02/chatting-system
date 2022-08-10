import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Pagination } from "swiper";
import "./chatting.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/bundle";
import { BsFillCameraVideoFill, BsMic } from "react-icons/bs";
import { FiPhoneCall, FiSend } from "react-icons/fi";
import {GoPrimitiveDot} from 'react-icons/go'
import {
  AiOutlineExclamationCircle,
  AiFillCamera,
  AiOutlineSetting,
} from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  GetRecentConversations,
  GetRecentMes,
  SendMesApi,
  SearchUserApi,
  CreateConversationApi,
  GetUsersOnline,
  GetConversationPtp
} from "../../redux/apiRequest";
import SearchByKey from "./searchByKey";
import CreateGroup from "./createGroup";
import UserInfo from "./userInfo";

const { io } = require("socket.io-client");
const socket = io(process.env.REACT_APP_BACKEND_URL);

const Chatting = () => {
  const isScrolled = useRef(false);
  // set to fetch more data when scroll
  const converRef = useRef();
  const messRef = useRef();

  // info of user
  const token = useSelector((state) => state.reducer.user.user?.accessToken);
  const userId = useSelector((state) => state.reducer.user.user?.userId);
  const avatarUrl = useSelector((state) => state.reducer.user.user?.avatarUrl);

  // setup socket
  socket.emit("user:connect", {
    userId: userId,
  });

  const [messagees, setMessagees] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [listUserOnline,  setListUserOnline] = useState([])

  // set to search users
  const [keySearch, setKeySearch] = useState();
  const [onFocusSearch, setOnFocusSearch] = useState(false);
  const [resultSearched, setResultSearched] = useState([]);
  const [conversationIsPicked, setConversationIsPicked] = useState();

  // set variables to get conversations or messages
  const [beginNumGetConver, setBeginNumGetConver] = useState(0);
  const [beginNumGetMess, setBeginNumGetMess] = useState(0);
  const [isLoadFullDataInMess, setIsLoadFullDataInMess] = useState(false);
  const [isLoadFullDataInCon, setIsLoadFullDataInCon] = useState(false);
  const LIMIT_CONVER = 15;
  const LIMIT_MESS = 15;

  // message send and receive
  const [newMessage, setNewMessage] = useState("");
  const [sendingMess, setSendingMess] = useState(false)
  const [getNewMessage, setGetNewMessage] = useState("");

  // state open feature modal
  const [displayCreateGroup, setDisplayCreateGroup] = useState("none");
  const [displayUserAction, setDisplayUserAction] = useState("none");

  const handleOpenCreateGroup = () => {
    setDisplayCreateGroup("block");
  };
  const handleSendMes = async() => {
    if (!newMessage) return;
    let data = {
      from: userId,
      to: conversationIsPicked._id,
      content: newMessage,
    };
    setSendingMess(true)
    await SendMesApi(token, data);
  };
  const onNewMesChange = (e) => {
    setNewMessage(e.target.value);
  };
  const onKeyDownSendMes = (e) => {
    if (e.key === "Enter") {
      handleSendMes();
    }
  };

  // HANDLE SEARCH USER
  const onKeySearchChange = (e) => {
    setKeySearch(e.target.value);
    if (e.target.value) SearchUserApi(token, e.target.value, setResultSearched);
  };

  const handleShowChat = (item, other) => {
    // console.log("redirect to show chat");
    setConversationIsPicked({
      ...item,
      nameOfChat: item.title || other.name,
      avatarUrl: item.avatarUrl || other.avatarUrl,
      status: other.status,
    });
    let data = {
      conversationId: item._id,
      begin: 0,
      limit: LIMIT_MESS,
    };
    GetRecentMes(token, data, setMessagees);
    setBeginNumGetMess(0);
    setIsLoadFullDataInMess(false);
  };
  const handleShowChatFromUserActive = async (item) => {
    setConversationIsPicked({
      ...item,
      nameOfChat: item.name,
      status: 'online'
    });
    debugger
    let conversation = await GetConversationPtp(token, item._id)
    let data = {
      conversationId: conversation ? conversation._id: item._id,
      begin: 0,
      limit: LIMIT_MESS,
    };
    setMessagees([])
    conversation && await GetRecentMes(token, data, setMessagees);
    setBeginNumGetMess(0);
    setIsLoadFullDataInMess(false);
  }
  const handleShowChatFromSearchBox = (item) => {
    setConversationIsPicked({
      ...item,
      nameOfChat: item.name
    });
    debugger
    if(item.hasConversation){
      let data = {
        conversationId: item._id,
        begin: 0,
        limit: LIMIT_MESS
      }
       GetRecentMes(token, data, setMessagees) 
      }
       else  setMessagees([])
       setBeginNumGetMess(0)
       setIsLoadFullDataInMess(false);
  };
  const scrollConvers = () => {
    const { scrollTop, scrollHeight, clientHeight } = converRef.current;
    if (
      scrollTop + clientHeight > 0.75 * scrollHeight &&
      !isLoadFullDataInCon
    ) {
      let check = GetRecentConversations(
        token,
        beginNumGetConver + LIMIT_CONVER,
        LIMIT_CONVER,
        setConversations,
        setIsLoadFullDataInCon
      );
      if (check === false) setIsLoadFullDataInCon(true);
      setBeginNumGetConver((prev) => prev + LIMIT_CONVER);
    }
  };
  
  const scrollMess = async () => {
    const { scrollTop, scrollHeight, clientHeight } = messRef.current;
    if (
      scrollTop * -1 + clientHeight > 0.75 * scrollHeight &&
      !isLoadFullDataInMess
    ) {
      if (!isScrolled.current) {
        // console.log("you are calling me");
        isScrolled.current = true;
        setTimeout(async () => {
          // console.log("you are calling me");
          let data = {
            conversationId: conversationIsPicked._id,
            begin: beginNumGetMess + LIMIT_MESS,
            limit: LIMIT_MESS,
          };
          let check = await GetRecentMes(
            token,
            data,
            setMessagees,
            setIsLoadFullDataInMess
          );
          if (check === false) {
            setIsLoadFullDataInMess(true);
          }
          setBeginNumGetMess((prev) => prev + LIMIT_MESS);
          isScrolled.current = false;
        }, 600);
      }
    }
  };

  const createGroup = async (data) => {
    let _converId = await CreateConversationApi(token, data);
    if (!_converId) return;
    await GetRecentConversations(token, 0, LIMIT_CONVER, setConversations);
    setMessagees([]);
    return 1;
  };

  useEffect(() => {
    socket.on("server:message", (data) => {
      if (data) {
        console.log(data);
        let _data = { ...data, from: { _id: data.from } };
        setGetNewMessage(_data);
        setNewMessage("");
      }
    });
  }, []);
  useEffect(() => {
    GetRecentConversations(
      token,
      beginNumGetConver,
      LIMIT_CONVER,
      setConversations
    );
    GetUsersOnline(token, setListUserOnline)
    // GetOnlineStatusUsers(token)
  }, [userId]);
  useEffect(() => {
    if (getNewMessage) {
      setMessagees([getNewMessage, ...messagees]);
      setGetNewMessage("");
      setSendingMess(false)
      GetRecentConversations(token, 0, LIMIT_CONVER, setConversations);
    }
  }, [getNewMessage]);
  return (
    <div className="container-fluid chatting">
      <div className="row">
        <div className="col-1 task-bar">
          <div
            className="user"
            onClick={(e) => {
              setDisplayUserAction("block");
            }}
          >
            <img src={require(`../../assests/image/${avatarUrl}`)} />
          </div>
          <AiOutlineSetting className="setting" />
        </div>
        <div className="col-3 user-list">
          <h2 className="chat-title">
            Chat <span onClick={handleOpenCreateGroup}>+</span>
          </h2>
          <div className="search-bar">
            <input
              placeholder="Tìm kiếm"
              value={keySearch}
              onFocus={(e) => {
                setOnFocusSearch(true);
              }}
              onBlur={(e) => {
                setOnFocusSearch(false);
                setKeySearch("");
                setResultSearched([])
              }}
              onChange={(e) => onKeySearchChange(e)}
            />
          </div>
          {!onFocusSearch ? (
            <>
              <div className="users-active">
                <Swiper
                  // navigation={true}
                  grabCursor={true}
                  spaceBetween={10}
                  slidesPerView={"auto"}
                  freeMode={true}
                  modules={[Pagination, Navigation, FreeMode]}
                >
                  {listUserOnline.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="users-active-item"
                        onClick={(e) => handleShowChatFromUserActive(item)}
                      >
                        <img src={require(`../../assests/image/${item.avatarUrl}`)} />
                        <GoPrimitiveDot className="active" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {conversations ? (
                <div
                  className="chatted-user"
                  onScroll={scrollConvers}
                  ref={converRef}
                >
                  {conversations.map((item, index) => {
                    let other = {};
                    if (item.type === "ptp") {
                      for (let i = 0; i < item.userIds.length; i++) {
                        if (item.userIds[i]._id !== userId) {
                          other = item.userIds[i];
                          item.avatarUrl = item.userIds[i].avatarUrl;
                        }
                      }
                    }
                    const userSendMessageIndex = item.userIds.findIndex(user => user._id === item.lastMessage?.from._id);
                    const userSendMessage = userSendMessageIndex === -1
                      ? null
                      : item.userIds?.[userSendMessageIndex];
                    return (
                      <div
                        key={index}
                        onClick={(e) => handleShowChat(item, other)}
                        className="item row"
                        id="user-item"
                      >
                        <div className="avatar col-3">
                            <img
                              src={require(`../../assests/image/${item.avatarUrl}`)}
                            />
                            {other?.status === 'online' && <GoPrimitiveDot className="active" /> }
                        </div>
                        <div className="info col-9">
                          <h5>{item.title || other.name}</h5>
                          <p
                            style={{
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                              padding: "0 10px",
                              overflow: " hidden",
                            }}
                          >
                            {`${userSendMessage?._id === userId ? 'Bạn' : userSendMessage?.name}: ${item.lastMessage?.content}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center mt-5">
                  {" "}
                  Bạn chưa có cuộc trò chuyện nào
                </p>
              )}
            </>
          ) : (
            <SearchByKey
              keySearch={keySearch}
              resultSearched={resultSearched}
              handleShowChatFromSearchBox={handleShowChatFromSearchBox}
              setOnFocusSearch={setOnFocusSearch}
              setResultSearched={setResultSearched}
              setKeySearch={setKeySearch}
            />
          )}
        </div>
        <div className="col-8 chat">
          {!conversationIsPicked ? (
            <p className="text-center mt-4" style={{ fontSize: "30px" }}>
              Chọn người bạn muốn chat cùng...
            </p>
          ) : (
            <>
              <div className="row chat-top">
                <div className="col-6 user">
                  <div className="avatar">
                    {conversationIsPicked.avatarUrl && (
                      <img
                        src={require(`../../assests/image/${conversationIsPicked.avatarUrl}`)}
                      />
                    )}
                  </div>
                  <div className="status">
                    <h5>{conversationIsPicked.nameOfChat}</h5>
                    <p>
                      {" "}
                      {conversationIsPicked.status
                        ? conversationIsPicked.status
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="col-6 call-action">
                  <BsFillCameraVideoFill className="video" />
                  <FiPhoneCall className="voice" />
                  <AiOutlineExclamationCircle className="detail" />
                </div>
              </div>
              <div className="chat-middle" ref={messRef} onScroll={scrollMess}>
              {sendingMess && 
              <div className="text-end pe-4" style={{color: 'black', width: '100%'}}>Đang gửi...</div>
              }
                {messagees.length === 0 ? (
                  <p
                    className="text-center mt-3"
                    style={{
                      width: "100%",
                      fontSize: "20px",
                      color: "black",
                      display: "block",
                      margin: "0 auto",
                    }}
                  >
                    {" "}
                    Chưa có tin nhắn trong cuộc trò chuyện
                  </p>
                ) : (
                  messagees.map((item, index) => {
                    let messFrom = "";
                    let userSentMess = item.from.name
                    let sentTime = "";
                    let date = new Date(item.createdAt);
                    sentTime =
                      sentTime +
                      date.getDay() +
                      "-" +
                      date.getMonth() +
                      "-" +
                      date.getFullYear() +
                      " " +
                      date.getHours() +
                      ":" +
                      date.getMinutes() +
                      ":" +
                      date.getMilliseconds();
                    if (item.from._id === userId) {
                      messFrom = "me";
                    } else {
                      messFrom = "other";
                    }
                    return (
                      <div key={index}>
                        <div className={`user-chat ${messFrom}`}>
                          <div className="avatar" title={userSentMess}>
                            <img
                              src={require(`../../assests/image/avatar13.png`)}
                            />
                          </div>
                          <p title={sentTime}>{item.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="chat-bottom">
                <AiFillCamera />
                <BsMic />
                <input
                  placeholder="Nhập tin nhắn ...."
                  onKeyDown={(e) => onKeyDownSendMes(e)}
                  value={newMessage}
                  onChange={(e) => onNewMesChange(e)}
                />
                <FiSend
                  className="sendMessage"
                  onClick={(e) => handleSendMes(e)}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="user-action">
        {displayUserAction === "block" && (
          <UserInfo setDisplayUserAction={setDisplayUserAction} />
        )}
      </div>
      <div
        className="create-group"
        style={{ display: `${displayCreateGroup}` }}
      >
        {displayCreateGroup === "block" && (
          <CreateGroup
            setDisplayCreateGroup={setDisplayCreateGroup}
            token={token}
            createGroup={createGroup}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
};

export default Chatting;
