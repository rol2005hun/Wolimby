import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Post from '../models/PostSchema';

const createReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findOne({ _id: req.body.postId });
        
        if (!post) {
            return res.status(404).send({
                success: false,
                error: 'Nincs ilyen bejegyzés.',
            });
        }

        const comment = post.comments.find(c => c._id == req.body.commentId);

        if (!comment) {
            return res.status(404).send({
                success: false,
                error: 'Nincs ilyen hozzászólás.',
            });
        }

        const reply = {
            _id: new Types.ObjectId(),
            author: req.body.author,
            description: req.body.description,
            file: req.body.file,
            likes: [],
            createdAt: new Date(),
        }

        comment.replies.push(reply);
        await post.save().then(() => {
            return res.status(201).send({
                success: true,
                reply: reply,
                message: 'Sikeres válasz.'
            });
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const editReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findOne({ _id: req.query.postId });
        
        if (!post) {
            return res.status(404).send({
                success: false,
                error: 'Nincs ilyen bejegyzés.',
            });
        }
        
        const comment = post.comments.find(c => c._id == req.query.commentId);
        
        if (!comment) {
            return res.status(404).send({
                success: false,
                error: 'Nincs ilyen hozzászólás.',
            });
        
        }

        const reply = comment.replies.find(r => r._id == req.query.replyId);

        if (!reply) {
            return res.status(404).send({
                success: false,
                error: 'Nincs ilyen válasz.',
            });
        }

        switch(req.query.editing) {
            case 'like':
                if(!reply.likes.includes(req.body.liker)) {
                    reply.likes.push(req.body.liker);
                    await post.save();
                } else {
                    const index = reply.likes.indexOf(req.body.liker);
                    if (index > -1) {
                        reply.likes.splice(index, 1);
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

const removeReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findOne({ _id: req.query.postId });
        
        if (!post) {
            return res.status(404).send({
                success: false,
                error: 'Nincs ilyen bejegyzés.',
            });
        
        }
        
        const comment = post.comments.find(c => c._id == req.query.commentId);
        
        if (!comment) {
            return res.status(404).send({
                success: false,
                error: 'Nincs ilyen hozzászólás.',
            });
        
        }

        const reply = comment.replies.find(r => r._id == req.query.replyId);
        
        if (!reply) {
            return res.status(404).send({
                success: false,
                error: 'Nincs ilyen válasz.',
            });
        }
        
        const index = comment.replies.indexOf(reply);
        
        if(index > -1) {
            comment.replies.splice(index, 1);
            await post.save();
        }

        return res.status(201).send({
            success: true,
            message: 'Sikeres törlés.',
        });
    } catch(err) {
        return res.status(404).send({
            success: false,
            message: err
        });
    }
}

export default {
    createReply,
    editReply,
    removeReply
}