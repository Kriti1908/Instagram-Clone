import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
      <div className='flex gap-3 items-center'>
        <Avatar>
            <AvatarImage src={comment.author?.profilePicture} alt="Comment_Imaage"/>
            <AvatarFallback>{comment.author?.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className='font-bold text-sa'>{comment?.author.username} <span className='font-normal'>{comment?.text}</span></h1>
      </div>
    </div>
  )
}

export default Comment
