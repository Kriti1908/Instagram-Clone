import React, { act, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  
  const {userProfile, user} = useSelector(store => store.auth);
  const displayPosts = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  const isLoggedInUserProfile = userProfile?._id === user?._id;
  const isFollowing = false;

  return (
    <div className='flex max-width-4xl mx-auto pl-10 justify-center' >
      <div className='flex flex-col gap-28 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='w-32 h-32'>
              <AvatarImage src={userProfile.profilePicture}/>
              <AvatarFallback>{userProfile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                    <Link to='/account/edit'><Button className='hover:bg-gray-200 h-8' variant='secondary'>Edit Profile</Button></Link>
                    <Button className='hover:bg-gray-200 h-8' variant='secondary'>View Archive</Button>
                    <Button className='hover:bg-gray-200 h-8' variant='secondary'>Ad Tools</Button>
                  </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant='secondary' >Unfollow</Button>
                        <Button variant='secondary' >Message</Button>
                      </>
                    ) : (
                      <Button className='bg-[#0095F6] hover:bg-[#3192D2] h-8' >Follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>{userProfile?.posts.length} <span className='font-normal'>posts</span></p>
                <p className='font-semibold'>{userProfile?.posts.length} <span className='font-normal'>followers</span></p>
                <p className='font-semibold'>{userProfile?.posts.length} <span className='font-normal'>following</span></p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold mr-3'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'> <AtSign/> <span className='pl-1'> {userProfile?.username}</span></Badge>
                <span>Line 1 of profile text</span>
                <span>Line 2 of profile text</span>
                <span>Line 3 of profile text</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''} `} onClick={() => handleTabChange('posts')}>
                POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''} `} onClick={() => handleTabChange('saved')}>
                SAVED
            </span>
            {/* <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold' : ''} `} onClick={() => handleTabChange('reels')}>
                REELS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'font-bold' : ''} `} onClick={() => handleTabChange('tags')}>
                TAGS
            </span> */}
          </div>

          <div className='grid grid-cols-3 gap-4'>
            {
              displayPosts?.map((post) => { 
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt='post' className='rounded-sm my-2 w-full aspect-square object-cover'/>
                    <div className='mt-2 mb-2 absolute opacity-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span className='ml-1'>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span className='ml-1'>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;
