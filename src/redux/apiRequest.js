import axios from "axios";

import { userVeryfiMail, userLogin, userForgotPw } from "./slice/userSlice";

const Axios = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // use withCredentials to allow server save cookie to client when different port between back and front
  // withCredentials: true
});

export const SignupEmailApi = async (email, setMess) => {
  try {
    await Axios.post("/auth/register-email", email);
    return 1;
  } catch (err) {
    console.log(err);
    if (err.response?.data?.errorCode) setMess(err.response?.data?.errorCode);
    else setMess(err.message)
    return 0;
  }
};

export const VerifySignedEmail = async (
  token,
  dispatch,
  setMess,
  setSuccess
) => {
  try {
    let res = await Axios.get(`/auth/create-account?token=${token}`);
    let action = res.data;
    action.token = token;
    dispatch(userVeryfiMail(action));
    setMess("Chúc mừng bạn đã xác thực email thành công!");
    setSuccess(1);
  } catch (err) {
    console.log(err);
    if (err.response?.data) setMess(err.response?.data?.errorMessage);
    else setMess(err.message)
    setSuccess(0);
  }
};

export const SignupApi = async (user, setMess, navigate) => {
  try {
    let res = await Axios.post('/auth/create-account', user)
   
    navigate('/login')
  } catch (err) {
    console.log(err);
    if(err.response?.data?.errorCode) setMess(err.response.data.errorCode)
    else setMess(err.message)
  }
};

export const LoginApi = async (user, setMess, navigate, dispatch) => {
    try {
        let res = await Axios.post('/auth/login', user)
        dispatch(userLogin(res.data))
        navigate('/chat')
      } catch (err) {
        console.log(err);
        if(err.response?.data?.errorCode) setMess(err.response.data.errorCode)
        else setMess(err.message)
      }
};

export const ForgotPwApi = async (email,token, setMess, navigate, dispatch) => {
    try {
        await Axios.post('/auth/forget-password/verify-email', email)
        navigate('/reset-password')
      } catch (err) {
        console.log(err);
        if(err.response?.data?.errorCode) setMess(err.response.data.errorCode)
        else setMess(err.message)
      }
};

export const ResetPwCheckTokenApi = async (setMess, token, setSuccessCheckToken,  dispatch) => {
  try {
    let res = await Axios.get(`/auth/reset-password?token=${token}`)
    dispatch(userForgotPw(res.data))
    setSuccessCheckToken(1)
  } catch(err) {
    console.log(err);
    if(err.response?.data?.errorCode) setMess(err.response.data.errorCode)
    else setMess(err.message)
    setSuccessCheckToken(0)
  }
}

export const ResetPwApi = async (setMess, user, setSuccessResetPw) => {
  try {
     await Axios.post(`/auth/reset-password`, user)
     setSuccessResetPw(1)
  } catch(err) {
    console.log(err);
    if(err.response?.data?.errorCode) setMess(err.response.data.errorCode)
    else setMess(err.message)
    setSuccessResetPw(0)
  }
}
