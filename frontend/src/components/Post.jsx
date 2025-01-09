import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';

const Post = ({ post }) => {
  const [text, setText] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();
  const [like, setLike] = useState(post.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes?.length || 0);
  const [comment, setComment] = useState(post.comments || []);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText('');
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:7070/api/v1/post/delete/${post._id}`, { withCredentials: true });
      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p?._id !== post?._id);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = like ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:7070/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      console.log("likeordislike called");
      if (res.data.success) {
        const updatedLikes = like ? postLike - 1 : postLike + 1;
        toast.success(res.data.message);
        setLike(!like);
        setPostLike(updatedLikes)
        const updatedPosts = posts.map((p) => {
          if (p?._id === post?._id) {
            if (action === 'like') {
              return { ...p, likes: [...p.likes, user?._id] };
            } else {
              return { ...p, likes: p.likes.filter((id) => id !== user?._id) };
            }
          }
          return p;
        });
        dispatch(setPosts(updatedPosts));
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  const commentHandler = async () => {
    try {
      const token = localStorage.getItem('token'); // or get it from the Redux store
      const res = await axios.post(
        `http://localhost:7070/api/v1/post/${post._id}/comment`,
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
          if (p?._id === post?._id) {
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

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:7070/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className='my-8 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="Post_Image" />
            <AvatarFallback>{post.author?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
          {
            user?._id === post?.author?._id && <Badge variant='secondary'>Author</Badge>
          }
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className='flex flex-col items-center text-sm text-center'>
            {
              post.author?._id !== user?._id && <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>Unfollow</Button>
            }

            <Button variant='ghost' className='cursor-pointer w-fit'>Add to favorites</Button>
            {
              user?._id === post?.author?._id && <Button variant='ghost' onClick={deletePostHandler} className='cursor-pointer w-fit'>Delete</Button>
              // Add edit option
              // <Button variant='ghost' className='cursor-pointer w-fit'>Edit</Button>
            }

          </DialogContent>
        </Dialog>
      </div>

      <img src={post.image}
        alt="Post_Image"
        className='rounded-sm my-4 w-full h-auto object-cover' />


      <div className='flex items-center justify-between my-2'>
        <div className='flex items-center gap-3'>
          {
            like ? <FaHeart size={'22px'} onClick={likeOrDislikeHandler} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
          }
          <MessageCircle onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }
          } className='cursor-pointer hover:text-gray-600' />
          <Send className='cursor-pointer hover:text-gray-600' />
        </div>
        <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
      </div>

      <span className='font-medium block mb-2'>{postLike} likes</span>

      <p>
        <span className='font-medium mr-2'>{post.author?.username}</span>
        {post.caption}
      </p>
      {
        comment.length > 0 && (
          <span onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }
          } className='cursor-pointer text-sm text-gray-400'>View all {post.comments.length} comments</span>
        )
      }
      <CommentDialog open={open} setOpen={setOpen} />

      <div className='flex items-center justify-between'>
        <input
          type="text"
          placeholder='Add a comment...'
          onChange={changeEventHandler}
          className='outline-none text-sm w-full'
        />
        {
          text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
        }
      </div>

    </div>
  )
}

export default Post;