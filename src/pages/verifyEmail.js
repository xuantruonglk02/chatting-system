import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { VerifySignedEmail } from "../redux/apiRequest";

const VerifyEmail = () => {
    let {token} = useParams()
    const [mess, setMess] = useState()
    const [success, setSuccess] = useState()
    const dispatch = useDispatch()
    
    useEffect(() => {
        VerifySignedEmail(token,dispatch, setMess, setSuccess)
    }, [])
    return (
        <>
       { success === 1 ? 
        <h2 className="text-center mt-4">{mess} xác thực thành công! <Link to="/signup" className="text-decoration-none"> Đăng ký ngay</Link> </h2>
        : 
        <h2 className="text-center mt-4">{mess}</h2>
    }
    </>
    )
}

export default VerifyEmail