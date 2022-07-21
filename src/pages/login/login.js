import "./login.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { LoginApi } from "../../redux/apiRequest";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const auth = useSelector((state) => state.auth); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mess, setMess] = useState("");


  let onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  let onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  let handleLogin = async (e) => {
    let user = {
      email, 
      password
    }
    LoginApi(user, setMess, navigate, dispatch)
  };
  return (

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
                    ĐĂNG NHẬP TÀI KHOẢN
                  </h2>
                  <form className="form-login">
                    <div className="form-outline mb-3">
                      <label>Email</label>
                      <input
                      type="text"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => onEmailChange(e)}
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
                      />
                    </div>
                    <p className="text-danger text-center mt-1 mb-0">{mess}</p>
                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary btn-block btn-lg gradient-custom-4 text-body mt-5"
                        onClick={(e) => handleLogin(e)}
                      >
                        Đăng nhập
                      </button>
                    </div>

                    <div className="login-options">
                    <p className="text-center text-muted">
                      <Link to="/forgot-password">
                        Quên mật khẩu?
                      </Link>
                    </p>
                    <p className="text-center text-muted">
                      Chưa có tài khoản?{" "}
                      <Link to="/signup">
                        Đăng ký
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
  );
};

export default Login;
