import React, { useEffect, useState } from "react";
import CreatePost from "../post/CreatePost";
import PostsList from "../post/PostsList";
import authHelper from "../auth/auth-helper";
import GeneralError from "../components/GeneralError";
import postApi from "../post/post-api"

export default function News() {

    const localInfo = authHelper.getLocalUser();

    const token = localInfo && localInfo.token;
    const userId = localInfo && localInfo.user._id;

    const [values, setValues] = useState({
        isLoading: false,
        error: '',
        posts: ''
    })

    useEffect(() => {
        let abortController = new AbortController()
        let signal = abortController.signal;

        allPosts(signal);

        return () => {
            abortController.abort();
        }
    }, [])

    async function allPosts(signal) {

        try {
            setValues({ ...values, isLoading: true, error: '' });

            let res = await postApi.allPosts(userId, token, signal);

            setValues({ ...values, isLoading: false, posts: res.posts });


        } catch (error) {

            setValues({ ...values, isLoading: false, error: error.message });

        }
    }

    function addPost(post) {
        let updatedPosts = [...values.posts];
        updatedPosts.unshift(post);
        setValues({ ...values, posts: updatedPosts });
    }

    function removePost(postId) {
        let updatedPosts = [...values.posts];
        updatedPosts = updatedPosts.filter(post => post._id != postId);
        setValues({ ...values, posts: updatedPosts });
    }

    async function addComment(text, userId, postId) {
        // fetch post and extract comment from it
        try {
            let res = await postApi.getPost(postId);

            let newComments = res.post.comments;


            let updatedPosts = [...values.posts];

            updatedPosts = updatedPosts.map(post => {
                if (post._id == postId) {
                    post.comments = newComments;
                    return post;
                }
                return post;
            });

            setValues({ ...values, posts: updatedPosts });
        } catch (error) {
            console.log(error);
            window.location.reload();
        }
    }

    function removeComment(postId, commentId) {
        let updatedPosts = [...values.posts];

        updatedPosts = updatedPosts.map(post => {
            if (post._id == postId) {
                post.comments = post.comments.filter(comment => comment._id != commentId);
                return post;
            }
            return post;
        });
        setValues({ ...values, posts: updatedPosts });
    }

    function addLike(postId, userId) {
        let updatedPosts = [...values.posts];

        updatedPosts = updatedPosts.map(post => {
            if (post._id == postId) {
                post.likes.push({ _id: userId })
                return post;
            }
            return post;
        })
        setValues({ ...values, posts: updatedPosts });
    }
    function removeLike(postId, userId) {
        let updatedPosts = [...values.posts];

        updatedPosts = updatedPosts.map(post => {
            if (post._id == postId) {
                post.likes = post.likes.filter(like => like._id != userId);
                return post;
            }
            return post;
        });
        setValues({ ...values, posts: updatedPosts });
    }

    return (
        <div id="newsComp" className="slide">
            <CreatePost addPost={addPost} />
            {
                values.error && <GeneralError error={values.error} />
            }
            {
                values.isLoading && <div>Loading...</div>
            }
            {
                values.posts && <PostsList addLike={addLike} removeLike={removeLike} removePost={removePost} removeComment={removeComment} addComment={addComment} userId={userId} token={token} posts={values.posts} />
            }
        </div>
    )
}