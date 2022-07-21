
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import { ResetPwCheckTokenApi, ResetPwApi } from "../../redux/apiRequest";

const ResetPw = () => {
  const navigate = useNavigate();
  const email = useSelector(state => state.reducer.user.user?.email)
  const {token} = useParams()
  const dispatch = useDispatch()

  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [mess, setMess] = useState('')
  const [messCheckToken, setMessCheckToken] = useState('')
  const [successCheckToken, setSuccessCheckToken] = useState(0)
  const [successResetPw, setSuccessResetPw] = useState(0)

  let onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  let onRepasswordChange = (e) => {
    setRepassword(e.target.value)
  }
  let handleResetPw = async () => {
    let user = {
      password, 
      repassword, 
      email, 
      token
    }
    ResetPwApi(setMess, user, setSuccessResetPw)
  };

  useEffect( () => {
    ResetPwCheckTokenApi(setMessCheckToken, token, setSuccessCheckToken,dispatch)
  }, [])
  return (
    <>
    {successCheckToken === 1?
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
                    THAY ĐỔI MẬT KHẨU
                  </h2>
                 {successResetPw === 0?
                  <form className="form-login">
                    <div className="form-outline mb-3">
                      <label>Mật khẩu mới</label>
                      <input
                       type="password"
                       className="form-control form-control-lg"
                       id="pwd"
                       value={password}
                       onChange={(e) => onPasswordChange(e)}
                      />
                    </div>

                    <div className="form-outline mb-3">
                      <label>Nhập lại mật khẩu mới</label>
                      <input
                       type="password"
                       className="form-control form-control-lg"
                       id="pwd"
                       value={repassword}
                       onChange={(e) => onRepasswordChange(e)}
                      />
                    </div>
                      <p className="text-danger text-center mt-1 mb-0"> {mess}</p>
                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary btn-block btn-lg gradient-custom-4 text-body mt-5 mb-2"
                        onClick={handleResetPw}
                      >
                        Xác nhận
                      </button>
                    </div>

                  </form>
                  :
                  <p className="lead text-center">Bạn đã đổi mật khẩu thành công! <Link className="text-decoration-none" to="/login">Đăng nhập ngay</Link></p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    :
    <h2 className="text-center mt-4">{messCheckToken}</h2> 
    }
    </>
  );
};

export default ResetPw
