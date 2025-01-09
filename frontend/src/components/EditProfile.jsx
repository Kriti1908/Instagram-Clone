import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

function EditProfile() {

  const {user} = useSelector(store => store.auth);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if(file){
        setInput({...input, profilePhoto: file});
    }
  }

  const selectChangeHandler = (value) => {
    setInput({...input, gender: value});
  }


  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append('bio', input.bio);
    formData.append('gender', input.gender);
    if(input.profilePhoto) {
        formData.append('profilePhoto', input.profilePhoto);
    }
    try {
        setLoading(true);
        const res = await axios.post('http://localhost:7070/api/v1/user/profile/edit', formData, {withCredentials: true}, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        if(res.data.success){
            const updatedData = {
                ...user, 
                bio: res.data.user.bio,
                profilePicture: res.data.user.profilePicture,
                gender: res.data.user.gender,
            }
            toast.success(res.data.message);
            dispatch(setAuthUser(updatedData));
            navigate(`/profile/${user?._id}`);
        }
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
} 

  return (
    <div className='flex max-w-2xl mx-auto pl-14'>
      <section className='flex flex-col w-full gap-5'>
        <h1 className='font-bold text-xl'>Edit Profile</h1>
        <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
            <div className='flex items-center gap-3'>
                <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="Post_Imaage"/>
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='text-sm font-semibold'>{user?.username}</h1>
                    <span className='text-gray-600 '>{user?.bio || "Bio here..."}</span>
                </div>
            </div>
            <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden'/>
            <Button className='bg-[#0095F6] hover:bg-[#318BC7] h-8 rounded' onClick={ ()=> imageRef?.current.click()}>Edit Profile picture</Button>
        </div>
        <div>
            <h1 className='font-bold text-xl mb-2'>Bio</h1>
            <Textarea name='bio' value={input.bio} onChange={(e)=>setInput({...input, bio:e.target.value})} className='focus-visible:ring-transparent'/>
        </div>
        <div>
            <h1 className='font-bold text-xl mb-2'>Gender</h1>
            <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-full">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div className='flex justify-center align-center text-center'>
            {
                loading ? (
                    <Button className='bg-[#0095F6] hover:bg-[#318BC7] h-8 rounded'>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin'/>
                        Please wait
                    </Button>           
                ) : (
                    <Button onClick={editProfileHandler} className='bg-[#0095F6] hover:bg-[#318BC7] h-8 rounded'>Save</Button>
                )
            }
        </div>
      </section>
    </div>
  )
}

export default EditProfile
