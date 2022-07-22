import Chatting from "./pages/chatting/chatting"
import Home from "./pages/home/home"
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import SignupEmail from "./pages/signupMail/signupMail";
import ForgotPw from "./pages/forgotPassword/forgotPw";
import ResetPw from "./pages/forgotPassword/resetPw";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import PageNotFound from "./pages/pageNotFound/pageNotFound";
import { useSelector } from "react-redux";


const Router = () => {
    const token = useSelector(state => state.reducer.user.user?.accessToken)
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Home/>} />
                <Route path="/chat" element={!token? <Navigate to='/' /> : <Chatting/>} />
                <Route path="/auth/create-account/:token" element={ <Signup />} />
                <Route path="/login" element={ <Login />} />
                <Route path="/signup-email" element={ <SignupEmail />} />
                <Route path="/forgot-password" element={ <ForgotPw />} />
                <Route path="/auth/reset-password/:token" element={ <ResetPw />} />
                <Route path="*" element={ <PageNotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router