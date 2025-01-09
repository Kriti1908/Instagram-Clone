import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post} from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';
import { getRecieverSocketId, io } from '../socket/socket.js';

export const addNewPost = async (req, res) => {
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image) {
            return res.status(400).json({
                message: 'Image is required'
            });
        }

        //Image post
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width: 800, height: 580, fit: 'inside'})
        .toFormat('jpeg', {quality: 80})
        .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        }) ;

        const user = await User.findById(authorId);
        if(user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path:'author', select:'-password'});

        return res.status(201).json({
            message: 'Post created successfully',
            post,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1})
        .populate({path: 'author', select: 'username profilePicture'})
        .populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });

        return res.status(200).json({
            message: 'All posts',
            posts,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author: authorId}).sort({createdAt: -1}).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });

        return res.status(200).json({
            message: 'User posts',
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    try {
        const LikerId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        //like logic
        await post.updateOne({ $addToSet: { likes: LikerId } });
        await post.save();

        //implement socket.io for real time like notification
        const user = await User.findById(LikerId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== LikerId) {
            const notification = {
                type: 'like',
                user: LikerId,
                userDetails: user,
                postId,
                // message: `${user.username} liked your post`,
                message: 'your post has been liked',
            }
            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            if(postOwnerSocketId) {
                io.to(postOwnerSocketId).emit('notification', notification);
            }
        }

        return res.status(200).json({
            message: 'Post liked',
            success: true
        });
        
    } catch (error) {
        console.log(error);
    }
}

export const dislikePost = async (req, res) => {
    try {
        const LikerId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        //like logic
        await post.updateOne({ $pull: { likes: LikerId } });
        await post.save();

        //implement socket.io for real time like notification
        const user = await User.findById(LikerId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== LikerId) {
            const notification = {
                type: 'dislike',
                user: LikerId,
                userDetails: user,
                postId,
                // message: `${user.username} disliked your post`,
                message: 'your post has been disliked',
            }
            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            if(postOwnerSocketId) {
                io.to(postOwnerSocketId).emit('notification', notification);
            }
        }

        return res.status(200).json({
            message: 'Post disliked',
            success: true
        });
        
    } catch (error) {
        console.log(error);
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentorId = req.id;

        const {text} = req.body;
        const post = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }
        if(!text) {
            return res.status(400).json({
                message: 'Comment is required',
                success: false
            });
        }

        const comment = await Comment.create({
            text,
            author: commentorId,
            post: postId
        });

        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment added',
            comment,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

// add delete comment logic

export const getPostComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post: postId}).populate(
            'author', 'username profilePicture'
        );

        if(!comments) {
            return res.status(404).json({
                message: 'No comments found',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Post comments',
            comments,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        //check if user is author or not of post
        if(post.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'You are not authorized to delete this post',
                success: false
            });
        }

        await Post.findByIdAndDelete(postId);
        //remove postId from user
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        //delete related comments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            message: 'Post deleted',
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        const user = await User.findById(authorId);
        if(!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        if(user.bookmarks.includes(postId)) {
            //bookmark already exists, remove existsing bookmark
            await user.updateOne({$pull: {bookmarks: postId}});
            await user.save();
            return res.status(200).json({
                type: 'unsaved',
                message: 'Post removed from bookmarks',
                success: true
            });
        } else {
            //add post to bookmarks
            await user.updateOne({$addToSet: {bookmarks: postId}});
            await user.save();
            return res.status(200).json({
                type: 'saved',
                message: 'Post added to bookmarks',
                success: true
            });
        }
        

    } catch (error) {
        console.log(error);
    }
}