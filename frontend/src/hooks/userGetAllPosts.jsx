import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPosts } from '../redux/postSlice';

const useGetAllPosts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchallPost = async () => {
            try {
                const res = await axios.get('http://localhost:7070/api/v1/post/all', {withCredentials: true});
                if(res.data.success) {
                    // console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchallPost();
    }, []);
};

export default useGetAllPosts;