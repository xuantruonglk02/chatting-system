import './JSX_main.css';



function Home() {

  const JSX_main = (


    
    <section className="JSX_main">

      {/* đoạn này là phần đầu của trang chủ gồm lô gô và nút đăng ký tài khoản */}
      <div className="heard_title">
        <div className="logo_title">
          <div className="logo_active">
            Chatting
          </div>
          <div className="infomation_help">
            <div className="infomation">
              hướng dẫn
            </div>
            <div className="help">
              trợ giúp
            </div>
            
          </div>

        </div>
        {/* ô này bên góc phải màn hình */}
        <div className="creative_register">
        
          <div className="register">tạo tài khoản</div>

        </div>
      </div>

      {/* ô này ở giữa trang sau đoạn lô gô */}
      <div className="slogan_login">
        <div className="slogan"> Kết nối để yêu thương</div>
        <div className="login">đăng nhập</div>
      </div>

    

  </section>

  );
    
  
  
  return JSX_main;
}
export default Home;
