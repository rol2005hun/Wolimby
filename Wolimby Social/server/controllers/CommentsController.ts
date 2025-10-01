import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Post from '../models/PostSchema';

const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findOne({ _id: req.body.postId });

        if (!post) {
            return res.status(404).send({
                success: false,
                error: 'Nincs ilyen bejegyzés.',
            });
        }
        
        const comment = {
            _id: new Types.ObjectId(),
            author: req.body.author,
            description: req.body.description,
            file: req.body.file,
            likes: [],
            replies: [],
            createdAt: new Date(),
        }

        post.comments.push(comment);
        await post.save().then(() => {
            return res.status(201).send({
                success: true,
                comment: comment,
                message: 'Sikeres hozzászólás.'
            });
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const editComment = async (req: Request, res: Response, next: NextFunction) => {
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

        switch (req.query.editing) {
            case 'like':
                if (!comment.likes.includes(req.body.liker)) {
                    comment.likes.push(req.body.liker);
                    await post.save();
                } else {
                    const index = comment.likes.indexOf(req.body.liker);
                    if (index > -1) {
                        comment.likes.splice(index, 1);
                        await post.save();
                    }
                }
                break;
        }

        return res.status(201).send({
            success: true,
            post: post,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            error: err.message,
        });
    }
}

const removeComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Post.updateOne({ _id: req.query.postId }, { $pull: { comments: { _id: req.query.commentId } }}, { safe: true, multi: true });

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
    createComment,
    editComment,
    removeComment
}