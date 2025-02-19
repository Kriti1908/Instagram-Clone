import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/chatSlice';

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAllMessage = async () => {
            if (selectedUser) {
                try {
                    const res = await axios.get(`http://localhost:7070/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true });
                    if (res.data.success) {
                        dispatch(setMessages(res.data.messages));
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        };
        fetchAllMessage();
    }, [selectedUser, dispatch]);
};

export default useGetAllMessage;