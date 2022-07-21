import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ForgotPwApi } from "../../redux/apiRequest";

const ForgotPw = () => {
  const [email, setEmail] = useState("");
  const [mess, setMess] = useState();
  const [success, setSuccess] = useState(0);
  const [display, setDisplay] = useState('none');

  let onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const enterKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleForgotPw(e);
    }
  };
  let handleForgotPw = async (e) => {
    setMess("");
    if (!email) setMess("Mục trên không được để trống");
    else {
      setDisplay("block");
      await ForgotPwApi(email, setMess, setSuccess);
      setDisplay("none")
    }
  };
  return (
    <section className="bg-image">
      <div className="mask d-flex align-items-center gradient-custom-3">
        <div className="container">
          <div className="row d-flex justify-content-center align-items-center vh-100">
            <div className="col-12 col-lg-9 col-lg-7 col-xl-6">
              <div className="card card-login">
                <div className="card-body">
                  <h2 className="text-uppercase text-center mb-5 pt-3">
                    QUÊN MẬT KHẨU
                  </h2>
                  {success == 0 ? (
                    <form className="form-login">
                      <div className="form-outline mb-3">
                        <label>Nhập email của bạn</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="email"
                          value={email}
                          onChange={(e) => onEmailChange(e)}
                          onKeyDown={(e) => enterKeyDown(e)}
                        />
                      </div>
                      <p className="text-danger text-center mt-1 mb-0">
                        {" "}
                        {mess}
                      </p>
                      <div className="d-flex justify-content-center button-submit">
                        <div className="loader" style={{display: `${display}`}}></div>
                        <button
                          type="button"
                          className="btn btn-primary btn-block btn-lg gradient-custom-4 text-body mt-5 mb-3"
                          onClick={(e) => handleForgotPw(e)}
                        >
                          Xác nhận
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-center lead">
                      Vui lòng kiểm tra hòm thư của bạn để tiếp tục thao tác
                    </p>
                  )}
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
