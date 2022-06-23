const Post = require('../models/post.model');
const formidable = require('formidable');
const fs = require('fs');
const User = require('../models/user.model');

const list = async function (req, res, next) {
    try {
        let posts = await Post.find({});
        res.status(200).json({
            success: true,
            posts
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}

const createPost = function (req, res, next) {
    const form = new formidable.IncomingForm();



    form.parse(req, async function (err, fields, files) {
        if (err) {
            return res.status(400).json({
                error: true,
                message: er.message || 'something went wrong'
            })
        }
        // validate text
        if (!validateCreate(fields.text)) {
            return res.status(400).json({
                error: true,
                message: 'text is required'
            })
        }

        if (files.photo) {
            let photo = {};
            photo.data = fs.readFileSync(files.photo.filepath);
            photo.contentType = files.photo.mimetype;
            fields.photo = photo;
        }

        try {
            fields.postedBy = req.params.userId;
            let post = new Post(fields);
            let newPost = await post.save();
            newPost = await Post.findById(newPost._id)
                .populate("postedBy", "_id name")
                .populate("likes", "_id name")
                .populate("comments.postedBy", "_id name")
            res.status(201).json({
                success: true,
                message: "successfully posted",
                post: newPost
            })
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message || 'something went wrong'
            })
        }
    })


}


const userPosts = async function (req, res, next) {
    try {
        let posts = await Post.find({
            postedBy: req.params.userId
        }).sort('-created')
            .populate("postedBy", "_id name")
            .populate("likes", "_id name")
            .populate("comments.postedBy", "_id name")
        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}

const allposts = async function (req, res, next) {
    try {
        let user = await User.findById(req.params.userId);
        let followings = [...user.followings];
        followings.push(user._id);

        let posts = await Post.find({
            postedBy: { $in: followings }
        }).sort('-created')
            .populate("postedBy", "_id name")
            .populate("likes", "_id name")
            .populate("comments.postedBy", "_id name")

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}

const getPost = async function (req, res, next) {
    try {
        let post = await Post.findById(req.params.postId)
            .populate("postedBy", "_id name")
            .populate("likes", "_id name")
            .populate("comments.postedBy", "_id name")
        if (!post) {
            return res.status(400).json({
                error: true,
                message: 'post not found'
            })
        }
        res.status(200).json({
            success: true,
            post
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}

const deletePost = async function (req, res, next) {
    try {
        await Post.deleteOne({
            _id: req.params.postId
        });
        res.status(200).json({
            success: true,
            message: "post deleted successfully"
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}

const photo = async function (req, res, next) {
    try {
        let post = await Post.findById(req.params.postId);

        if (post && post.photo) {
            res.set("Content-Type", post.photo.contentType);
            return res.send(post.photo.data)
        }

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}

const createComment = async function (req, res, next) {
    try {
        let text = req.body.text;
        let { userId, postId } = req.params;
        // validate text
        if (!text && text.trim().length == 0) {
            return res.status(400).json({
                error: true,
                message: 'text is required'
            })
        }
        let comment = {
            text,
            postedBy: userId,
            created: Date.now()
        }

        let newCom = await Post.findOneAndUpdate({
            _id: postId
        }, {
            $push: {
                comments: comment
            }
        }).exec()

        res.status(200).json({
            success: true,
            message: "commented successfully",
            comment: newCom
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}


const removeComment = async function (req, res, next) {
    try {
        const { userId, postId, commentId } = req.params;
        let post = await Post.findById(postId);
        let comments = post.comments.filter(comment => comment._id != commentId)
        post.comments = comments;
        await post.save()

        res.status(200).json({
            success: true,
            message: 'comment deleted successfully'
        })

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}


const addLike = async function (req, res, next) {
    try {
        const { userId, postId } = req.params;
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({
                error: true,
                message: 'post not found'
            })
        }

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({
            success: true,
            message: 'like added successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}


const removeLike = async function (req, res, next) {
    try {
        const { userId, postId } = req.params;
        let post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({
                error: true,
                message: 'post not found'
            })
        }

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(like => like != userId);
        }

        await post.save();
        res.status(200).json({
            success: true,
            message: 'like removed successfully'
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}

///////////////// helpers ////////////
function validateCreate(text) {
    let pass = true;
    if (!text || text.length === 0) {
        pass = false
    }
    return pass;
}


const authorizDelete = async function (req, res, next) {
    try {
        let post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(400).json({
                error: true,
                message: 'post not found'
            })
        }
        if (post.postedBy != req.params.userId) {
            return res.status(400).json({
                error: true,
                message: 'you are not authorized to delete this post'
            })
        }
        next()
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}

const authorizComment = async function (req, res, next) {
    try {
        const { userId, postId, commentId } = req.params;
        // query post
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({
                error: true,
                message: 'post not found'
            })
        }
        // extract comment
        let comment = post.comments.length > 0 && post.comments.filter(comment => comment._id == commentId)[0];
        if (comment.postedBy != userId) {
            return res.status(400).json({
                error: true,
                message: 'you are not authorized to delete this comment'
            });
        }
        next();
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || 'something went wrong'
        })
    }
}





module.exports = {
    createPost, userPosts, allposts,
    deletePost, authorizDelete, photo,
    createComment, authorizComment,
    removeComment, getPost, addLike,
    removeLike
}