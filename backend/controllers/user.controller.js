import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';

export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(401).json({
                message: 'Please fill in all fields',
                success: false
            });
        };
        const user = await User.findOne({email});
        if(user) {
            return res.status(401).json({
                message: 'User already exists',
                success: false
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: 'Account created successfully',
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(401).json({
                message: 'Please fill in all fields',
                success: false
            });
        };

        let user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false
            });
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false
            });
        };

        const token = await sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        //populate each post id in the post array
        const poplatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        );

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: poplatedPosts
        }

        
        return res.cookie('token', token, {httpOnly: true, sameSite:'strict', maxAge: 1*24*60*60*1000}).status(200).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });


    } catch (error) {
        console.log(error);
    }
}

export const logout = async (_, res) => {
    try {
        return res.clearCookie('token').status(200).json({
            message: 'Logged out successfully',
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        // console.log(user);
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;
        
        let cloudResponse;

        if(profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if(!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
                req: req.body
            });
        };

        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).limit(5);
        if(!suggestedUsers) {
            return res.status(400).json({
                message: 'No suggested users found',
            });
        }
        return res.status(200).json({
            users: suggestedUsers,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const personWhoFollows = req.id;
        const personToFollow = req.params.id;

        if(personWhoFollows === personToFollow) {
            return res.status(400).json({
                message: 'You cannot follow or unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(personWhoFollows);
        const target = await User.findById(personToFollow);

        if(!user || !target) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // check whether the user is already following the target
        const isFollowing = user.following.includes(personToFollow);
        if(isFollowing) {       // unfollow logic
            await Promise.all([
                User.updateOne({_id: personWhoFollows}, {$pull: {following: personToFollow}}),
                User.updateOne({_id: personToFollow}, {$pull: {followers: personWhoFollows}}),
            ]);

            return res.status(200).json({
                message: 'Unfollowed successfully',
                success: true
            });
        } else {                // follow logic
            await Promise.all([
                User.updateOne({_id: personWhoFollows}, {$push: {following: personToFollow}}),
                User.updateOne({_id: personToFollow}, {$push: {followers: personWhoFollows}}),
            ]);
            return res.status(200).json({
                message: 'Followed successfully',
                success: true
            });
        }

    } catch (error) {
        console.log(error);
    }
}