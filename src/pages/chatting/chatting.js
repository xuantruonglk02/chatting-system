import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Pagination } from "swiper";
import "./chatting.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/bundle";
import { BsFillCameraVideoFill, BsMic } from "react-icons/bs";
import { FiPhoneCall, FiSend } from "react-icons/fi";
import {
  AiOutlineExclamationCircle,
  AiFillCamera,
  AiOutlineHome,
  AiOutlineSetting,
} from "react-icons/ai";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  GetRecentConversations,
  GetRecentMes,
  SendMesApi,
} from "../../redux/apiRequest";

const { io } = require("socket.io-client");
const socket = io(process.env.REACT_APP_BACKEND_URL);

const Chatting = () => {
  const [arr, setArr] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 10, 39, 11, 22, 3, 5, 6,
  ]);
  const isScrolled = useRef(false);
  // set to fetch more data when scroll
  const converRef = useRef();
  const messRef = useRef();
  const scrollToBottomRef = useRef();

  // info of user
  const token = useSelector((state) => state.reducer.user.user?.accessToken);
  const userId = useSelector((state) => state.reducer.user.user?.userId);

  const [messagees, setMessagees] = useState([]);
  const [conversations, setConversations] = useState([]);

  // set to search users
  const [keySeach, setKeySeach] = useState();
  const [onFocusSearch, setOnFocusSearch] = useState(false);
  const [conversationIsPicked, setConversationIsPicked] = useState();

  // set variables to get conversations or messages
  const [beginNumGetConver, setBeginNumGetConver] = useState(0);
  const [beginNumGetMess, setBeginNumGetMess] = useState(0);
  const [isLoadFullDataInMess, setIsLoadFullDataInMess] = useState(false);
  const [isLoadFullDataInCon, setIsLoadFullDataInCon] = useState(false);
  const LIMIT_CONVER = 15;
  const LIMIT_MESS = 15;
  const [newMessage, setNewMessage] = useState("");
  const [getNewMessage, setGetNewMessage] = useState("");
  const [avatarIsOpen, setAvatarIsOpen] = useState("none");
  const [avatarIsPicked, setAvatarIsPicked] = useState(-1);

  const handleOpenCreateGroup = () => {
    alert("you have clicked on me");
  };
  const handleSendMes = async () => {
    if (!newMessage) return;
    let data = {
      from: userId,
      to: conversationIsPicked._id,
      content: newMessage,
    };
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
  const onKeySearchChange = (e) => {
    setKeySeach(e.target.value);
  };
  const handleShowChat = (item, other) => {
    console.log("redirect to show chat");
    setConversationIsPicked({
      ...item,
      nameOfChat: item.title || other.name,
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
      if (!check) setIsLoadFullDataInCon(true);
      setBeginNumGetConver((prev) => prev + LIMIT_CONVER);
    }
  };
  const updateConversList = () => {
    let _conver = conversations;
    if (_conver[0]._id === conversationIsPicked._id) {
      _conver[0].lastMessage.content = getNewMessage.content;
      setConversations([..._conver]);
      return;
    }
    for (let i = 0; i < _conver.length; i++) {
      if (_conver[i]._id === conversationIsPicked._id) {
        let temp = _conver[i];
        temp.lastMessage.content = getNewMessage.content;
        _conver.splice(i, 1);
        _conver.unshift(temp);
        return;
      }
    }
  };
  const scrollMess = async () => {
    const { scrollTop, scrollHeight, clientHeight } = messRef.current;
    if (
      scrollTop * -1 + clientHeight > 0.75 * scrollHeight &&
      !isLoadFullDataInMess
    ) {
      if (!isScrolled.current) {
        console.log("you are calling me");
        console.log(beginNumGetConver);
        isScrolled.current = true;
        setTimeout(async () => {
          console.log("you are calling me");
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

  const handleSetAvatar = () => {
    setAvatarIsOpen("block");
  };
  const handlePickAvatar = (index) => {
    setAvatarIsPicked(index);
  };

  useEffect(() => {
    socket.on("server:message", (data) => {
      if (data) {
        let _data = { ...data, from: { _id: data.from } };
        setGetNewMessage(_data);
        setNewMessage("");
      }
    });
  });
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("user:connect", {
        userId: userId,
      });
    });
    GetRecentConversations(
      token,
      beginNumGetConver,
      LIMIT_CONVER,
      setConversations
    );
  }, [userId]);
  useEffect(() => {
    if (getNewMessage) {
      setMessagees([getNewMessage, ...messagees]);
      setGetNewMessage("");
      updateConversList();
    }
  }, [getNewMessage]);
  return (
    <div className="container-fluid chatting">
      <div className="row">
        <div className="col-1 task-bar">
          <AiOutlineHome className="home" />
          <AiOutlineSetting className="setting" />
        </div>
        <div className="col-3 user-list">
          <h2 className="chat-title">
            Chat <span onClick={handleOpenCreateGroup}>+</span>
          </h2>
          <div className="search-bar">
            <input
              placeholder="Tìm kiếm"
              value={keySeach}
              onFocus={(e) => {
                setOnFocusSearch(true);
              }}
              onBlur={(e) => {
                setOnFocusSearch(false);
                setKeySeach("");
              }}
              onChange={(e) => onKeySearchChange(e)}
            />
          </div>
          {!onFocusSearch ? (
            <>
              <div className="users-active">
                <Swiper
                  navigation={true}
                  grabCursor={true}
                  spaceBetween={10}
                  slidesPerView={"auto"}
                  freeMode={true}
                  modules={[Pagination, Navigation, FreeMode]}
                >
                  {arr.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="users-active-item"
                        // onClick={(e) => handleShowChat(item)}
                      >
                        <img src={require("../../assests/image/avatar1.png")} />
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
                        }
                      }
                    }
                    return (
                      <div
                        key={index}
                        onClick={(e) => handleShowChat(item, other)}
                        className="item row"
                        id="user-item"
                      >
                        <div className="avatar col-3">
                          <img
                            src={require(`../../assests/image/avatar16.png`)}
                          />
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
                            {item.lastMessage?.content}
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
            <div className="chatted-user">
              <p>Kết quả tìm kiếm cho "{keySeach}"</p>
              {arr.map((item, index) => (
                <div key={index} className="item row pt-1 pb-1">
                  <div className="avatar col-3">
                    <img src={require(`../../assests/image/avatar16.png`)} />
                  </div>
                  <div className="info col-9">
                    <h5 className="mt-3">user name</h5>
                  </div>
                </div>
              ))}
            </div>
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
                    <img src={require(`../../assests/image/avatar11.png`)} />
                  </div>
                  <div className="status">
                    <h5>{conversationIsPicked.nameOfChat}</h5>
                    <p> active</p>
                  </div>
                </div>
                <div className="col-6 call-action">
                  <BsFillCameraVideoFill className="video" />
                  <FiPhoneCall className="voice" />
                  <AiOutlineExclamationCircle className="detail" />
                </div>
              </div>
              <div className="chat-middle" ref={messRef} onScroll={scrollMess}>
                {!messagees ? (
                  <p
                    style={{ color: "black", display: "block" }}
                    className="text-center mt-3"
                  >
                    {" "}
                    Chưa có tin nhắn trong cuộc trò chuyện
                  </p>
                ) : (
                  messagees.map((item, index) => {
                    let messFrom = "";
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
                          <div className="avatar">
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
                <div ref={scrollToBottomRef}></div>
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
      <div className="set-avatar">
        <button
          style={{
            display: "inline",
            position: "absolute",
            top: "0",
            right: "20px",
          }}
          onClick={handleSetAvatar}
        >
          click me
        </button>
        <div
          className="show-or-not-frame"
          style={{ display: `${avatarIsOpen}` }}
        >
          <ul>
            {arr.map((item, index) => (
              <li
                key={index}
                onClick={(e) => handlePickAvatar(index)}
                className={index === avatarIsPicked ? "active" : ""}
              >
                {" "}
                <img
                  src={require(`../../assests/image/avatar${index + 1}.png`)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
