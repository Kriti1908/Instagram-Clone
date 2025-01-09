import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';

const CommentDialog = ({ open, setOpen }) => {
  const dialogRef = useRef(null);
  const [text, setText] = React.useState('');
  const { selectedPost } = useSelector(store => store.post);
  const dispatch = useDispatch();
  const { posts } = useSelector(store => store.post);
  const [comment, setComment] = useState(selectedPost?.comments);

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if(inputText.trim()) {
        setText(inputText);
    } else {
        setText('');
    }
  }

  const sendEventHandler = async () => {
      try {
          const token = localStorage.getItem('token'); // or get it from the Redux store
          const res = await axios.post(
              `http://localhost:7070/api/v1/post/${selectedPost._id}/comment`,
              { text },
              {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  withCredentials: true
              }
          );

          if (res.data.success) {
              const updatedComments = [...comment, res.data.comment];
              setComment(updatedComments);
              const updatedPosts = posts.map((p) => {
                  if (p._id === selectedPost._id) {
                      return { ...p, comments: updatedComments };
                  }
                  return p;
              });
              dispatch(setPosts(updatedPosts));
              toast.success(res.data.message);
              setText(""); // Clear the text input after successfully adding the comment
          }

      } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
      }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, setOpen]);

  return (
    <Dialog open={open}>
      <DialogContent ref={dialogRef} className='max-w-4xl p-0 flex-col'>

        <div className='flex flex-1'>
            <div className='w-1/2'>
                <img
                src={selectedPost?.image}
                alt="Post_Image"
                className='w-full max-h-[500px] object-cover rounded-lg'
                />
            </div>

            <div className='w-1/2 flex flex-col justify-between'>
                <div className='flex items-center justify-between p-4'>
                    <div className='flex gap-3 items-center'>
                        <Link>
                            <Avatar>
                                <AvatarImage src={selectedPost?.author?.profilePicture} alt="Profile_Imaage"/>
                                <AvatarFallback>{selectedPost?.author?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                {/* <h1>Username</h1> */}
                            </Avatar>
                        </Link>
                        <div> 
                        <Link className='font-semibold text-xs pr-1'>{selectedPost?.author?.username}</Link>
                            {/* <span className='text-gray-600 text-small'>Bio...</span> */}
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <MoreHorizontal className='cursor-pointer'/>    
                        </DialogTrigger>
                        <DialogContent className='flex flex-col items-center text-sm text-center'>
                            <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                                Unfollow
                            </div>
                            <div className='cursor-pointer w-full'>
                                Add to favorites
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <hr/>
                <div className='flex-1 overflow-y-auto p-4 max-h-[400px]'>
                    {
                      comment?.map((comment) => (
                        <Comment key={comment._id} comment={comment}/>
                      ))
                    }
                </div>
                <div className='p-4'>
                    <div className='flex gap-2 items-center'>
                        <input type='text' onChange={changeEventHandler} placeholder='Add a comment...' className='w-full outline-noneborder border-gray-300 p-2 rounded text-sm'/>
                        <Button disabled={!text.trim()} variant='ghost' onClick={sendEventHandler} className='text-[#3BADF8]'>Post</Button>
                    </div>

                </div> 
            </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
