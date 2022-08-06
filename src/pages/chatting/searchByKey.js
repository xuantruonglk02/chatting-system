import {GoPrimitiveDot} from 'react-icons/go'
import { memo } from 'react'

const SearchByKey = (props) => {
    const {keySearch, resultSearched} = props

    return (
        <div className="list-user-searched">
        <p>Kết quả tìm kiếm cho "{keySearch}"</p>
        {resultSearched?.map((item, index) => (
          <div key={index} className="item row pt-1 pb-1">
            <div className="avatar col-3">
              <img src={require(`../../assests/image/avatar16.png`)} />
                {item.status === 'online' && 
                <GoPrimitiveDot className='active'/>
                }
            </div>
            <div className="info col-9">
              <h5 className="mt-3">{item.name}</h5>
            </div>
          </div>
        ))}
      </div>
    )
}

export default memo(SearchByKey)