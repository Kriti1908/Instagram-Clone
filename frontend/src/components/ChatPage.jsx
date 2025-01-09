import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { use } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import { setMessages } from '@/redux/chatSlice';
import axios from 'axios';

function ChatPage() {
    const {user, suggestedUsers, selectedUser} = useSelector(store => store.auth);
    const isOnline = true;
    const dispatch = useDispatch();
    const {onlineUsers, messages} = useSelector(store => store.chat);
    const [textMessage, setTextMessage] = useState('');

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:7070/api/v1/message/send/${receiverId}`, {textMessage}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if(res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage('');
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

  return (
    <div className='flex ml-[16%] h-screen'>
      <section className='w-full md:w-1/4 border-r border-gray-300'>
        <h1 className='font-bold mb-4 px-5 text-xl'>{user?.username}</h1>
        <hr className='mb-4 border-gray-300'/>
        <div className='overflow-y-auto h-[80vh]'>
            {
                suggestedUsers.map((suggestedUser) => {
                    const isOnline = onlineUsers.includes(suggestedUser._id);
                        return (
                        <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer'>
                            <Avatar className='w-12 h-12'>
                                <AvatarImage src={suggestedUser?.profilePicture}/>
                                <AvatarFallback>{suggestedUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <h1 className='font-medium'>{suggestedUser.username}</h1>
                                <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline? 'online': 'offline'}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>

      </section>
      {
        selectedUser ? (
            <section className='flex-1 border-l border-gray-300 flex flex-col h-full'>
                <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                    <Avatar>
                        <AvatarImage src={selectedUser?.profilePicture} alt='profile'/>
                        <AvatarFallback>{selectedUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <span>{selectedUser?.username}</span>
                    </div>
                </div>
                <Messages selectedUser={selectedUser }/>
                <div className='flex items-center p-4 border-t border-t-gray-300'>
                    <Input type='text' value={textMessage} onChange = {(e) => setTextMessage(e.target.value)} className='flex-1 mr-2 focus-visible:ring-transparent' placeholder="Message..." />
                    <Button onClick={() => sendMessageHandler(selectedUser?._id)} className='' >Send</Button>
                </div>
            </section>

        ) : (
            <div className='flex flex-col items-center justify-center mx-auto flex-1'>
                <MessageCircleCode className='w-24 h-24 '/>
                <h1 className='font-medium text-gray-500'>Your messages</h1>
                <span className='text-gray-500'>Send a message to start a chat</span>
            </div>
        )
      }
    </div>
  )
}

export default ChatPage;
