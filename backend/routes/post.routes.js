const express = require("express");
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');

const postCtrl = require('../controllers/post.controller');

// get individual user posts
router.route('/api/posts/:userId')
    .get(
        authCtrl.authenticate,
        authCtrl.verify,
        postCtrl.userPosts
    )
// get one post
router.route('/api/posts/one/:postId')
    .get(
        postCtrl.getPost
    )
// get all posts (user and his followings)
router.route('/api/posts/all/:userId')
    .get(
        authCtrl.authenticate,
        authCtrl.authoriz,
        postCtrl.allposts
    )



// create new post
router.route('/api/posts/new/:userId')
    .post(
        authCtrl.authenticate,
        authCtrl.authoriz,
        postCtrl.createPost
    )

// delete a post
router.route('/api/posts/:postId/:userId')
    .delete(
        authCtrl.authenticate,
        authCtrl.authoriz,
        postCtrl.authorizDelete,
        postCtrl.deletePost
    )


// post image
router.route('/api/posts/:postId/:userId/image')
    .get(
        postCtrl.photo
    )

// post a comment
router.route('/api/posts/:postId/:userId/comments')
    .put(
        authCtrl.authenticate,
        authCtrl.verify,
        postCtrl.createComment
    )

// delete a comment
// post a comment
router.route('/api/posts/:postId/:userId/comments/remove/:commentId')
    .put(
        authCtrl.authenticate,
        authCtrl.verify,
        postCtrl.authorizComment,
        postCtrl.removeComment
    )

// add a like
router.route('/api/posts/:postId/:userId/likes/add')
    .put(
        authCtrl.authenticate,
        authCtrl.verify,
        postCtrl.addLike
    )

// remove a like
router.route('/api/posts/:postId/:userId/likes/remove')
    .put(
        authCtrl.authenticate,
        authCtrl.verify,
        postCtrl.removeLike
    )

router.param('userId', userCtrl.userById);




module.exports = router