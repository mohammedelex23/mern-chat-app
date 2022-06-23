import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authHelper from "../auth/auth-helper";
import GeneralError from "../components/GeneralError";
import postApi from "./post-api";
import PostsList from './PostsList'

export default function Posts() {

    const { userId } = useParams();
    const token = authHelper.getToken();
    

    const [values, setValues] = useState({
        posts: '',
        isLoading: false,
        error: ''
    })

    useEffect(() => {
        let abortController = new AbortController()
        let signal = abortController.signal;
        getUserPosts(signal);

        return () => {
            abortController.abort();
        }
    }, [userId]);

    async function getUserPosts(signal) {
        try {
            setValues({ ...values, isLoading: true, error: '' })


            let res = await postApi.getUserPosts(userId, token, signal);

            setValues({ ...values, isLoading: false, posts: res.posts })

        } catch (error) {
            setValues({ ...values, isLoading: false, error: error.message })
        }
    }


    ///////////// PostsList props ////////////
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
        <div id="first" className="animation w-full fisrt shrink-0" >
            {/* , removeComment, removePost,addLike,removeLike  */}
            {
                values.error && <GeneralError error={values.error} />
            }
            {
                values.isLoading && <div>{values.isLoading}</div>
            }
            {
                values.posts && <PostsList
                    posts={values.posts} userId={userId} token={token}
                    removePost={removePost}
                    addComment={addComment} removeComment={removeComment}
                    addLike={addLike} removeLike={removeLike}
                />
            }
        </div>
    );
}