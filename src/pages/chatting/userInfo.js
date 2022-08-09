import { memo, useEffect, useRef, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { ChangeUserNameApi, ChangePwApi, ChangeAvtApi } from "../../redux/apiRequest";
import { BsCameraFill } from "react-icons/bs";

const UserInfo = (props) => {

  const arr = [
    1, 2, 3, 4, 5, 6, 7, 8, 10, 39, 11, 22, 3, 5, 6,
  ]
  const dispatch = useDispatch();

  const mainRef = useRef();

  const token = useSelector((state) => state.reducer.user.user?.accessToken);
  const username = useSelector((state) => state.reducer.user.user?.name);
  const avatarUrl = useSelector((state) => state.reducer.user.user?.avatarUrl);
  const email = useSelector((state) => state.reducer.user.user?.email);

  const { setDisplayUserAction } = props;

  const [isUserInfoOpen, setIsUserInfoOpen] = useState("none");
  const [isSetUsername, setIsSetUsername] = useState("none");
  const [isChangePw, setIsChangePw] = useState("none");
  const [isShowMain, setIsShowMain] = useState("block");
  const [isShowOverlay, setIsShowOverlay] = useState("none");
  const [avatarIsOpen, setAvatarIsOpen] = useState("none");
  const [avatarIsPicked, setAvatarIsPicked] = useState(-1);
  const [showModalUserHeight, setShowModalUserHeight] = useState("152px");

  const [newUserName, setNewUserName] = useState("");

  const [pw, setPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [reNewPw, setReNewPw] = useState("");
  const [errMessChangeUsername, setErrMessChangeUsername] = useState("");
  const [errMessChangePw, setErrMessChangePw] = useState("");

  const handleCloseChangeUsername = () => {
    setIsSetUsername("none");
    setErrMessChangeUsername("");
    setPw("");
    setNewUserName("");
  };
  const pressEnterChangeUsername = (e) => {
    if (e.key === "Enter") {
      handleChangeUsername();
    }
  };
  const pressEnterChangePw = (e) => {
    if (e.key === "Enter") {
      handleChangePw();
    }
  };
  const handleChangeUsername = async () => {
    if (!pw || !newUserName) {
      setErrMessChangeUsername("Mục trên không được để trống");
      return;
    }
    if (newUserName === username) {
      setErrMessChangeUsername("Tên mới phải khác tên cũ");
      return;
    }
    let data = {
      newName: newUserName,
      password: pw,
    };
    setErrMessChangeUsername("");
    let success = await ChangeUserNameApi(
      token,
      data,
      setErrMessChangeUsername,
      dispatch
    );
    if (success === 1) handleCloseChangeUsername();
  };
  const handleCloseUserInfo = () => {
    setPw("");
    setNewUserName("");
    setErrMessChangeUsername("");
    setIsSetUsername("none");
    setIsUserInfoOpen("none");
    setDisplayUserAction("none");
  };
  const handleChangePw = async () => {
    if (!pw || !newPw || !reNewPw) {
      setErrMessChangePw("Các mục trên k được để trống");
      return;
    }
    setErrMessChangePw("");
    let data = {
      password: pw,
      newPassword: newPw,
      reNewPassword: reNewPw,
    };
    let success = await ChangePwApi(token, data, setErrMessChangePw);
    if (success === 1) {
      setErrMessChangePw("Successful");
      setPw("");
      setNewPw("");
      setReNewPw("");
    }
  };
  const handleCloseChangePw = () => {
    setPw("");
    setErrMessChangePw("");
    setIsChangePw("none");
    setNewPw("");
    setReNewPw("");
    setDisplayUserAction("none");
  };
  const handleOpenSetAvatar = () => {
    setAvatarIsOpen("block");
  };
  const handlePickAvatar = (index) => {
    setAvatarIsPicked(index);
  };  
  const handleChangeAvt = async () => {
    if(avatarIsPicked === -1) return 
    let data = {
      newAvatarUrl: 'avatar' + avatarIsPicked + '.png'
    }
    let success = await ChangeAvtApi(token, data, dispatch)
    if(success === 1) setAvatarIsOpen('none')
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (mainRef.current && !mainRef.current.contains(event.target)) {
        setDisplayUserAction("none");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mainRef]);
  // }

  useEffect(() => {
    isSetUsername === "none"
      ? setShowModalUserHeight("152px")
      : setShowModalUserHeight("228px");
  }, [isSetUsername]);
  return (
    <>
      <div className="overlay" style={{ display: `${isShowOverlay}` }}></div>
      {isShowMain === "block" && (
        <div className="main" ref={mainRef}>
          <div className="info">
            <p
              onClick={(e) => {
                setIsUserInfoOpen("block");
                setIsChangePw("none");
                setIsShowOverlay("block");
                setIsShowMain("none");
              }}
            >
              Thông tin tài khoản
            </p>
          </div>

          <div className="change-password">
            <p
              onClick={(e) => {
                setIsChangePw("block");
                setIsUserInfoOpen("none");
                setIsShowOverlay("block");
                setIsShowMain("none");
              }}
            >
              Đổi mật khẩu
            </p>
          </div>

          <div className="logout">
            <p> Đăng xuất</p>
          </div>
        </div>
      )}
      <div
        className="show-modal-info"
        style={{
          display: `${isUserInfoOpen}`,
          top: `calc(50vh - ${showModalUserHeight})`,
        }}
      >
        <div className="avatar">
          <img src={require(`../../assests/image/${avatarUrl}`)} />
            <BsCameraFill onClick={handleOpenSetAvatar}/>
        </div>
        <div className="user-name">
          <p>Tài khoản: &nbsp; {username}</p>
          {isSetUsername === "none" ? (
            <BsPencil
              onClick={(e) => {
                setIsSetUsername("block");
              }}
            />
          ) : (
            <IoMdClose onClick={handleCloseChangeUsername} />
          )}
          <div
            className="change-user-name"
            style={{ display: `${isSetUsername}` }}
          >
            <input
              placeholder="Nhập tên mới..."
              type="text"
              onChange={(e) => setNewUserName(e.target.value)}
              value={newUserName}
              onKeyDown={(e) => pressEnterChangeUsername(e)}
            />
            <input
              placeholder="Nhập mật khẩu..."
              type="password"
              onChange={(e) => setPw(e.target.value)}
              value={pw}
              onKeyDown={(e) => pressEnterChangeUsername(e)}
            />
            <p className="error-message">{errMessChangeUsername}</p>
            <button onClick={handleChangeUsername}>Lưu</button>
          </div>
        </div>
        <div className="email">
          <p>Email: &nbsp; {email}</p>
        </div>
        <button className="cancel" onClick={handleCloseUserInfo}>
          Thoát
        </button>
      </div>
      <div
        className="show-modal-change-password"
        style={{ display: `${isChangePw}` }}
      >
        <input
          placeholder="Mật khẩu cũ..."
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => pressEnterChangePw(e)}
        />
        <input
          placeholder="Mật khẩu mới..."
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          onKeyDown={(e) => pressEnterChangePw(e)}
        />
        <input
          placeholder="Nhập lại mật khẩu mới..."
          type="password"
          value={reNewPw}
          onChange={(e) => setReNewPw(e.target.value)}
          onKeyDown={(e) => pressEnterChangePw(e)}
        />
        <p
          className={
            errMessChangePw === "Successful" ? "success" : "error-message"
          }
        >
          {errMessChangePw}
        </p>
        <div className="btn-action">
          <button onClick={handleCloseChangePw}>Hủy</button>
          <button onClick={handleChangePw}>Lưu</button>
        </div>
      </div>
      <div className="set-avatar">
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
                  src={require(`../../assests/image/avatar${index}.png`)}
                />
              </li>
            ))}
          </ul>
          <div className="btn-action">
          <button onClick={e => {setAvatarIsOpen('none')}}>Hủy</button>
          <button className={avatarIsPicked === -1? 'disable' : ''} onClick={handleChangeAvt}>Lưu</button>
        </div>
        </div>
      </div>
    </>
  );
};

export default memo(UserInfo);
