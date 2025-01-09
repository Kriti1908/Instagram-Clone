import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    });

    const {user} = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        // console.log(input);
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:7070/api/v1/user/login", input, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if(res.data.success){
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: "",
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(user){
            navigate('/');
        }
    }, []);

    return (
        <div className="flex items-center w-screen h-screen justify-center">
            <form onSubmit={loginHandler} className="shadow-lg flex flex-col gap-5 p-8">
                <div>
                    <h1 className="text-center font-bold text-xl">LOGO</h1>
                    <p className="test-sa text-center">Login to see photos & videos from your friends.</p>
                </div>
                <div>
                    <Label>Email</Label>
                    <Input
                    type="text" 
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    className="focus-visible:ring-transparent my-2"
                      />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input
                    type="password" 
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    className="focus-visible:ring-transparent my-2"
                      />
                </div>
                {
                    loading ? (
                        <button>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Loading...
                        </button>
                    ) : (
                        <Button type='submit'>Login</Button>
                    )
                }
                <span className="text-center">Don't have an account? <Link to='/signup' className="text-blue-600">Create a new account</Link></span>
            </form>
        </div>
    );
};

export default Login;