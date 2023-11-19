import { NextFunction, Request, Response } from 'express';
import Post from '../models/PostSchema';

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    const newPost = new Post({
        author: req.body.author,
        description: req.body.description,
        file: req.body.file
    });

    try {
        newPost.save().then(() => {
            return res.status(201).send({
                success: true,
                message: 'Sikeres bejegyzés.'
            });
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const getPost = async (req: Request, res: Response, next: NextFunction) => {
    const post = await Post.findOne({ _id: req.query.postid }).populate(['author', 'comments.author', 'comments.replies.author']);
    return res.status(201).send({
        success: true,
        post: post
    });
}

const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
    const posts = await Post.find().populate(['author', 'comments.author', 'comments.replies.author']);
    return res.status(201).send({
        success: true,
        posts: posts.reverse().map(post => ({
            ...post.toJSON(),
            comments: post.comments.reverse(),
        })),
    });
}

const editPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findOne({ _id: req.query.postId });

        switch(req.query.editing) {
            case 'like':
                if(!post.likes.includes(req.body.liker)) {
                    post.likes.push(req.body.liker);
                    await post.save();
                } else {
                    const index = post.likes.indexOf(req.body.liker);
                    if (index > -1) {
                        post.likes.splice(index, 1);
                        await post.save();
                    }
                }
                break;
        }

        return res.status(201).send({
            success: true,
            post: post
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const removePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findByIdAndDelete({ _id: req.query.postId });

        return res.status(201).send({
            success: true,
            message: 'Sikeres törlés.',
            post: post
        });
    } catch(err) {
        return res.status(404).send({
            success: false,
            message: err
        });
    }
}

export default {
    createPost,
    getPost,
    getAllPost,
    editPost,
    removePost
}