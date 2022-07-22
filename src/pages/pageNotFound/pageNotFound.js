import {Link} from 'react-router-dom'


const PageNotFound = () => {

    return (
        <h1 className='text-center mt-4'>TRANG NÀY KHÔNG TỒN TẠI QUAY LẠI TRANG CHỦ <Link className="text-decoration-none" to="/chat">TẠI ĐÂY</Link> </h1>
    )
}

export default PageNotFound