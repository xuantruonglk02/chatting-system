
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import { SignupApi,  VerifySignedEmail } from "../../redux/apiRequest";

const ForgotPw = () => {
  const navigate = useNavigate();
  const {token} = useParams()
  const dispatch = useDispatch()
  const email = useSelector(state => state.reducer.user.user?.email)
  // const dispatch = useDispatch();
  // const auth = useSelector((state) => state.auth); 

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [mess, setMess] = useState('')
  const [successCheckToken, setSuccessCheckToken] = useState()
  const [display, setDisplay] = useState('none')

  let onUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  let onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  let onRepasswordChange = (e) => {
    setRepassword(e.target.value)
  }
  const enterKeyDown = (e) => {
    if (e.key === "Enter") {
        handleSignup(e)
    }
  };
  let handleSignup = async (e) => {
    setMess('')
    if(!username || !password || !repassword) setMess(prev => 'Các mục trên không được để trống')
    else {
      let user = {
        name: username,
        password, 
        repassword, 
        email, 
        token
      }
      setDisplay('block')
      await SignupApi(user, setMess, navigate)
      setDisplay('none')
    }
  };

  useEffect( () => {
    VerifySignedEmail(token, dispatch, setMess, setSuccessCheckToken)
  }, [])
  return (
    <>
     {successCheckToken == 1? 
      <section className="bg-image">
      <div className="mask d-flex align-items-center gradient-custom-3">
        <div className="container">
          <div className="row d-flex justify-content-center align-items-center vh-100">
            <div className="col-12 col-lg-9 col-lg-7 col-xl-6">
              <div
                className="card card-login"
              >
                <div className="card-body">
                  <h2 className="text-uppercase text-center mb-5 pt-3">
                    ĐĂNG KÝ TÀI KHOẢN
                  </h2>
                  <form className="form-login" >
                    <div className="form-outline mb-3">
                      <label>Tên người dùng</label>
                      <input
                      type="text"
                      className="form-control form-control-lg"
                      id="email"
                      value={username}
                      onChange={(e) => onUsernameChange(e)}
                      onKeyDown={(e) => enterKeyDown(e)}
                      />
                    </div>

                    <div className="form-outline mb-3">
                      <label>Mật khẩu</label>
                      <input
                       type="password"
                       className="form-control form-control-lg"
                       id="pwd"
                       value={password}
                       onChange={(e) => onPasswordChange(e)}
                       onKeyDown={(e) => enterKeyDown(e)}
                      />
                    </div>

                    <div className="form-outline mb-3">
                      <label>Nhập lại mật khẩu</label>
                      <input
                       type="password"
                       className="form-control form-control-lg"
                       id="pwd"
                       value={repassword}
                       onChange={(e) => onRepasswordChange(e)}
                       onKeyDown={(e) => enterKeyDown(e)}
                      />
                    </div>
                     <p className="text-danger text-center"> {mess}</p>
                    <div className="d-flex justify-content-center button-submit">
                    <div className="loader" style={{display: `${display}`}}></div>
                      <button
                        type="button"
                        className="btn btn-primary btn-block btn-lg gradient-custom-4 text-body mt-5"
                        onClick={(e) => handleSignup(e)}
                      >
                        Đăng ký
                      </button>
                    </div>

                    <div className="login-options">
                    <p className="text-center text-muted">
                      Đã có tài khoản?{" "}
                      <Link to="/login">
                        Đăng nhập
                      </Link>
                    </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    :
    <h2 className="text-center mt-4">{mess}</h2>
    }
    </>
  );
};

export default ForgotPw;
