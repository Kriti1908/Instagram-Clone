import React from 'react'
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import MessageSidebar from './MessageSidebar';
import useGetAllPosts from '@/hooks/userGetAllPosts';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

function Home() {
  useGetAllPosts();
  useGetSuggestedUsers();
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='flex-grow'>
          <Feed/>
          <Outlet/>
      </div>
      <div className='hidden md:block'>
        <MessageSidebar/>
      </div>
    </div>
  )
}

export default Home;