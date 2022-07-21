import Chatting from "./pages/chatting/chatting"
import Home from "./pages/home/home"
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import SignupEmail from "./pages/signupMail/signupMail";
import ForgotPw from "./pages/forgotPassword/forgotPw";
import ResetPw from "./pages/forgotPassword/resetPw";
import { BrowserRouter, Routes, Route } from "react-router-dom";


const Router = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Home/>} />
                <Route path="/chat" element={ <Chatting/>} />
                <Route path="/auth/create-account/:token" element={ <Signup />} />
                <Route path="/login" element={ <Login />} />
                <Route path="/signup-email" element={ <SignupEmail />} />
                <Route path="/forgot-password" element={ <ForgotPw />} />
                <Route path="/auth/reset-password/:token" element={ <ResetPw />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router