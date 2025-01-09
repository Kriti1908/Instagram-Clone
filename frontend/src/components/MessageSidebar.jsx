import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

function MessageSidebar() {

  const { user } = useSelector(store => store.auth);

  return (
    <div className='w-fit my-10 pr-24'>
        <div className='flex items-center gap-2'>
          <Link to={`/profile/${user?._id}`}>
            <Avatar>
                <AvatarImage src={user?.profilePicture} alt="Post_Imaage"/>
                <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <h1 className='text-sm font-semibold'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
            <span className='text-gray-600 text-sm'>{user?.bio || "Bio here..."}</span>
          </div>
        </div>


        <SuggestedUsers/>
    </div>
  )
}

export default MessageSidebar
