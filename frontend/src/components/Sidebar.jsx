import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, Menu } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

function Sidebar() {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:7070/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate('/login');
                toast.success('Logged out successfully');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const createPostHandler = () => {
        setOpen(true);
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === 'Create') {
            createPostHandler();
        } else if (textType === 'Profile') {
            navigate(`/profile/${user?._id}`);
        } else if (textType === 'Home') {
            navigate('/');
        } else if (textType === 'Messages') {
            navigate('/chat');
        }
        setSidebarOpen(false); // Close sidebar on navigation
    }

    const sideBarItems = [
        { icon: <Home />, text: 'Home', link: '/' },
        { icon: <Search />, text: 'Search', link: '/' },
        { icon: <TrendingUp />, text: 'Explore', link: '/' },
        { icon: <MessageCircle />, text: 'Messages', link: '/' },
        { icon: <Heart />, text: 'Notifications', link: '/' },
        { icon: <PlusSquare />, text: 'Create', link: '/' },
        {
            icon: (
                <Avatar className='w-8 h-8'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            ), text: 'Profile', link: '/'
        },
        { icon: <LogOut />, text: 'Logout', link: '/' },
    ]

    return (
        <>
            <div className='md:hidden fixed top-0 left-0 z-20 p-4'>
                <Button onClick={() => setSidebarOpen(!sidebarOpen)} className='p-2'>
                    <Menu />
                </Button>
            </div>
            <div className={`fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-full md:w-[20%] h-screen justify-items-center bg-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className='flex flex-col'>
                    <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                    <div>
                        {
                            sideBarItems.map((item, index) => {
                                return (
                                    <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-5 relative hover:bg-gray-100 rounded-lg cursor-pointer p-3 my-3'>
                                        <div className='w-8 flex-shrink-0 justify-items-center'>
                                            {item.icon}
                                        </div>
                                        <span className='flex-grow'>{item.text}</span>
                                        {
                                            item.text === 'Notifications' && likeNotification.length > 0 && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button className='rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600 hover:bg-red-700' size='icon'>{likeNotification?.length}</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <div>
                                                            {
                                                                likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                    likeNotification.map((Notification) => {
                                                                        return (
                                                                            <div key={Notification._id} className='flex items-center gap-3 p-2'>
                                                                                <Avatar className='w-8 h-8'>
                                                                                    <AvatarImage src={Notification?.userDetails?.profilePicture} alt={Notification.user.username} />
                                                                                    <AvatarFallback>{Notification?.userDetails?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                                                                </Avatar>
                                                                                <p><span className='font-bold'>{Notification.userDetails.username}</span> liked your post</p>
                                                                            </div>
                                                                        )
                                                                    })
                                                                )
                                                            }
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <CreatePost open={open} setOpen={setOpen} />

            </div>
        </>
    )
}

export default Sidebar;