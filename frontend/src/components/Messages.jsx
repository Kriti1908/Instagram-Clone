import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import useGetAllMessage from '../hooks/useGetAllMessage'; // Correct import
import useGetRTM from '@/hooks/useGetRealTime';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className='w-32 h-32'>
                        <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                        <AvatarFallback>{selectedUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className='my-2'>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}><Button className='h-8 my-1' variant='secondary'>View Profile</Button></Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {
                    messages && messages.map((message, index) => (
                        <div key={index} className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2 pr-3 pl-3 rounded-3xl max-w-xs break-words ${message.senderId === user._id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                                {message.message} 
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Messages;