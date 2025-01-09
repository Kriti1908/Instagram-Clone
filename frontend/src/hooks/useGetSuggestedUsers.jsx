import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSuggestedUsers } from '@/redux/authSlice';

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('http://localhost:7070/api/v1/user/suggested', {withCredentials: true});
                if(res.data.success) {
                    // console.log(res.data.users);
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchSuggestedUsers();
    }, []);
};

export default useGetSuggestedUsers;