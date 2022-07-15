import Chatting from "./pages/chatting/chatting"
import Home from "./pages/home/home"
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Router = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Home/>} />
                <Route path="/chat" element={ <Chatting/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router