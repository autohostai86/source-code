import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const MessageSkelaton = ({ cards }) => {
  return Array(cards).fill(0).map((i) => (
    <a href="#/" onClick={(e) => { return false }} key={i} className='mb-5'>
      {/* <div className="badge bg-success float-right">{item?.['hasUnreadMessages']}</div> */}
      <div className="d-flex align-items-start">
        {/* <Skeleton circle width={40} height={40}/> */}
        <div className="flex-grow-1 ml-3">
          <Skeleton count={1} />
          <div className="xl">
            <Skeleton count={1} />
            {/* <p className='text-overflow'>{item?.['conversationMessages']?.[0]?.['body']}</p> */}
          </div>
        </div>
      </div>
    </a>
  ))
}

export default MessageSkelaton;