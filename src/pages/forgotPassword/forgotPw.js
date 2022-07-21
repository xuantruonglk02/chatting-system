
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ForgotPwApi } from "../../redux/apiRequest";

const ForgotPw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const token = 'vinh'

  const [email, setEmail] = useState("");
  const [mess, setMess] = useState()

  let onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  let handleForgotPw = async (e) => {
    ForgotPwApi(email, token, setMess, navigate, dispatch)
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
                    QUÊN MẬT KHẨU
                  </h2>
                  <form className="form-login">
                    <div className="form-outline mb-3">
                      <label>Nhập email của bạn</label>
                      <input
                      type="text"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => onEmailChange(e)}
                      />
                    </div>
                    <p className="text-danger text-center mt-1 mb-0"> {mess}</p>
                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary btn-block btn-lg gradient-custom-4 text-body mt-5 mb-3"
                        onClick={(e) => handleForgotPw(e)}
                      >
                        Xác nhận
                      </button>
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

export default ForgotPw;
