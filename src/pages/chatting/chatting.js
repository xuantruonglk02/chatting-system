import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Pagination } from "swiper";
import "./chatting.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/bundle";
import {BsFillCameraVideoFill, BsMic} from 'react-icons/bs'
import {FiPhoneCall, FiSend} from 'react-icons/fi'
import {AiOutlineExclamationCircle, AiFillCamera, AiOutlineHome, AiOutlineSetting} from 'react-icons/ai'
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Chatting = () => {
  let arr = [1, 2, 3, 4, 5, 6, 7, 8];
  const navigate = useNavigate()
  const token = useSelector(state => state.reducer.user.user?.accessToken)
  return (
    <div className="container-fluid chatting">
    <div className="row">
      <div className="col-1 task-bar">
          <AiOutlineHome className="home"/>
          <AiOutlineSetting className="setting"/>
      </div>
      <div className="col-3 user-list">
        <h2 className="chat-title">Chat</h2>
        <div className="search-bar">
          <input placeholder="Tìm kiếm" />
        </div>
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
              <SwiperSlide>
                <div className="users-active-item">LV</div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="chatted-user">
          {arr.map((item, index) => (
            <div className="item row">
              <div className="avatar col-3">LV</div>
              <div className="info col-9">
                <h5>user name</h5>
                <p> message</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-8 chat">
        <div className="row chat-top">
          <div className="col-6 user">
            <div className="avatar">LV</div>
            <div className="status">
              <h5>user name</h5>
              <p> active</p>
            </div>
          </div>
          <div className="col-6 call-action">
              <BsFillCameraVideoFill className="video" />
              <FiPhoneCall className="voice"/>
              <AiOutlineExclamationCircle className="detail" />
          </div>
        </div>
        <div className="chat-middle">
          {arr.map( (item, index) => 
             <>
              <div className="user-chat other">
              <div className="avatar">LV</div>
              <p className="other">autoprefixer: Replace color-adjust to print-color-adjust. The color-adjust shorthand is currentl</p>
           </div>
           <div className="user-chat me">
            <div className="avatar">LV</div>
             <p >c dịch từ tiếng Anh-
Trong xuất bản và thiết kế đồ họa, Lorem ipsum là văn bản giữ chỗ thường được sử dụng để thể hiện hình thức trực quan của tài liệu hoặc kiểu chữ mà không dựa trên nội dung có ý nghĩa. Lorem ipsum có thể được sử dụng làm trình giữ chỗ trước</p>
           </div>
           </>
          )}
        </div>
        <div className="chat-bottom">
          <AiFillCamera />
          <BsMic />
          <input placeholder="Nhập tin nhắn ...." />
          <FiSend />
        </div>
      </div>
    </div>
  </div>
  );
};

export default Chatting;
