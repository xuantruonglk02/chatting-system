import axios from "axios";

import {
  userVeryfiMail,
  userLogin,
  userForgotPw,
  updateUsername,
  updateAvtUrl,
} from "./slice/userSlice";

const Axios = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // use withCredentials to allow server save cookie to client when different port between back and front
  // withCredentials: true
});

export const SignupEmailApi = async (email, setMess) => {
  try {
    await Axios.post("/auth/register-email", { email });
    return 1;
  } catch (err) {
    console.log(err);
    if (err.response?.data?.errorMessage)
      setMess(err.response?.data?.errorMessage);
    else setMess(err.message);
    return 0;
  }
};

export const VerifySignedEmail = async (
  token,
  dispatch,
  setMess,
  setSuccessCheckToken
) => {
  try {
    let res = await Axios.get(`/auth/create-account?token=${token}`);
    let action = res.data;
    action.token = token;
    dispatch(userVeryfiMail(action));
    setSuccessCheckToken(1);
  } catch (err) {
    console.log(err);
    if (err.response?.data) setMess(err.response?.data?.errorMessage);
    else setMess(err.message);
    setSuccessCheckToken(0);
  }
};

export const SignupApi = async (user, setMess, navigate) => {
  try {
    let res = await Axios.post("/auth/create-account", user);
    navigate("/login");
  } catch (err) {
    console.log(err);
    if (err.response?.data?.errorMessage)
      setMess(err.response.data.errorMessage);
    else setMess(err.message);
  }
};

export const LoginApi = async (user, setMess, navigate, dispatch) => {
  try {
    let res = await Axios.post("/auth/login", user);
    dispatch(userLogin(res.data));
    navigate("/chat");
  } catch (err) {
    console.log(err);
    if (err.response?.data?.errorMessage)
      setMess(err.response.data.errorMessage);
    else setMess(err.message);
  }
};

export const ForgotPwApi = async (email, setMess, setSuccess) => {
  try {
    await Axios.post("/auth/forget-password/verify-email", { email });
    setSuccess(1);
  } catch (err) {
    console.log(err);
    if (err.response?.data?.errorMessage)
      setMess(err.response.data.errorMessage);
    else setMess(err.message);
    setSuccess(0);
  }
};

export const ResetPwCheckTokenApi = async (
  setMess,
  token,
  setSuccessCheckToken,
  dispatch
) => {
  try {
    let res = await Axios.get(`/auth/reset-password?token=${token}`);
    dispatch(userForgotPw(res.data));
    setSuccessCheckToken(1);
  } catch (err) {
    console.log(err);
    if (err.response?.data?.errorMessage)
      setMess(err.response.data.errorMessage);
    else setMess(err.message);
    setSuccessCheckToken(0);
  }
};

export const ResetPwApi = async (setMess, user, setSuccessResetPw) => {
  try {
    await Axios.post(`/auth/reset-password`, user);
    setSuccessResetPw(1);
  } catch (err) {
    console.log(err);
    if (err.response?.data?.errorMessage)
      setMess(err.response.data.errorMessage);
    else setMess(err.message);
    setSuccessResetPw(0);
  }
};

export const SendMesApi = async (accessToken, data) => {
  try {
    Axios.post("/message/send", data, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    return 1;
  } catch (err) {
    console.log(err);
  }
};

export const GetRecentMes = async (
  accessToken,
  data,
  setMessagees,
  setIsLoadFullDataInMess
) => {
  try {
    let res = await Axios.get(
      `/message/get?conversationId=${data.conversationId}&begin=${data.begin}&limit=${data.limit}`,
      {
        headers: {
          "x-access-token": accessToken,
        },
      }
    );
    if (res.data.messages.length === 0 && data.begin !== 0) {
      return false;
    }
    if (data.begin === 0) setMessagees([...res.data.messages]);
    else setMessagees((prev) => [...prev, ...res.data.messages]);
  } catch (err) {
    console.log(err);
    alert(err.respone);
    // setIsLoadFullDataInMess(true)
  }
};

export const GetRecentConversations = async (
  accessToken,
  begin,
  limit,
  setConversations,
  setIsLoadFullDataInCon
) => {
  try {
    let res = await Axios.get(
      `/conversation/get-recent?begin=${begin}&limit=${limit}`,
      {
        headers: {
          "x-access-token": accessToken,
        },
      }
    );
    if (res.data.conversations.length === 0) {
      return false;
    }
    // console.log(res.data.conversations);
    if (begin === 0) setConversations([...res.data.conversations]);
    else setConversations((prev) => [...prev, ...res.data.conversations]);
  } catch (err) {
    console.log(err);
    alert(err.respone);
  }
};

export const SearchUserApi = async (accessToken, key, setResultSearched) => {
  try {
    let res = await Axios.get(`/user/search?keyword=${key}`, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    console.log(res.data);
    setResultSearched(res.data.users);
  } catch (err) {
    console.log(err);
    alert(err);
  }
};

export const CreateConversationApi = async (accessToken, data) => {
  try {
    let res = await Axios.post(`/conversation/create`, data, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    console.log(res.data);
    return res.data.conversationId;
  } catch (err) {
    console.log(err);
    alert(err);
  }
};

export const GetOnlineStatusUsers = async (accessToken) => {
  try {
    let res = await Axios.get("/user/online-status", {
      headers: {
        "x-access-token": accessToken,
      },
    });
    console.log(res.data);
  } catch (err) {
    console.log(err);
    alert(err);
  }
};

export const ChangeUserNameApi = async (
  accessToken,
  data,
  setErrMessChangeUsername,
  dispatch
) => {
  try {
    await Axios.post("/user/profile/change/name", data, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    dispatch(updateUsername(data.newName));
    return 1;
  } catch (err) {
    console.log(err);
    setErrMessChangeUsername(err.response?.data?.errorMessage);
  }
};

export const ChangePwApi = async (accessToken, data, setErrMessChangePw) => {
  try {
    await Axios.post("/user/profile/change/password", data, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    setErrMessChangePw("Đổi mật khẩu thành công");
    return 1;
  } catch (err) {
    console.log(err);
    setErrMessChangePw(err.response?.data?.errorMessage);
  }
};

export const ChangeAvtApi = async (accessToken, data, dispatch) => {
  try {
    await Axios.post("/user/profile/change/avatar", data, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    dispatch(updateAvtUrl(data.newAvatarUrl));
    return 1;
  } catch (err) {
    console.log(err);
    alert(err);
  }
};

export const GetConversationPtp = async (accessToken, targetUserId) => {
  try {
    let res = await Axios.get(
      `/conversation/ptp?targetUserId=${targetUserId}`,
      {
        headers: {
          "x-access-token": accessToken,
        },
      }
    );
    return res.data.conversation;
  } catch (err) {
    console.log(err);
    alert(err);
  }
};

export const GetUsersOnline = async (accessToken, setListUserOnline) => {
  try {
    // debugger;
    let res = await Axios.get("/user/online", {
      headers: {
        "x-access-token": accessToken,
      },
    });
    setListUserOnline(res.data.users)
  } catch (err) {
    console.log(err);
    alert(err);
  }
};
