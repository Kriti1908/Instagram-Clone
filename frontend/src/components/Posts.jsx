import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux';

function Posts() {
  const {posts} = useSelector(state => state.post);

  return (
    <div>
        {
          // make n instead of 4
            posts?.map((post) => <Post key={post._id} post={post}/>)
        }   
    </div>
  )
}

export default Posts
