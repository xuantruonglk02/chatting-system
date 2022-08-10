import { GoPrimitiveDot } from "react-icons/go";
import { memo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetConversationPtp } from "../../redux/apiRequest";

const SearchByKey = (props) => {
  const token = useSelector((state) => state.reducer.user.user?.accessToken);
  const mainRef = useRef()
  const userId = useSelector((state) => state.reducer.user.user?.userId);
  const { keySearch, resultSearched, handleShowChatFromSearchBox, setOnFocusSearch, setResultSearched, setKeySearch} = props;

  const handleRedirectToLiveChat = async (item) => {
    if(item._id === userId) return
    let data = {
      ...item,
      nameOfChat: item.name,
    };
    let conversation = await GetConversationPtp(token, item._id)
      debugger
    data.hasConversation = conversation ? true : false
    if(conversation) data._id = conversation._id
    handleShowChatFromSearchBox(data);
    setOnFocusSearch(false)
    setResultSearched([])
    setKeySearch('')
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (mainRef.current && !mainRef.current.contains(event.target)) {
        setOnFocusSearch(false)
        setResultSearched([])
        setKeySearch('')
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mainRef]);
  return (
    <div className="list-user-searched" ref={mainRef}>
      <p>Kết quả tìm kiếm cho "{keySearch}"</p>
      {resultSearched?.map((item, index) => (
        <div
          key={index}
          className="item row pt-1 pb-1"
          onClick={(e) =>handleRedirectToLiveChat(item)}
        >
          <div className="avatar col-3">
            <img src={require(`../../assests/image/${item.avatarUrl}`)} />
            {item.status === "online" && <GoPrimitiveDot className="active" />}
          </div>
          <div className="info col-9">
            <h5 className="mt-3">{item.name}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(SearchByKey);
