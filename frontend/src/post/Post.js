import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from 'react-icons/md'
import { BiComment, BiHeart } from 'react-icons/bi'
import { AiFillHeart } from 'react-icons/ai'
import config from "../config";
import CommentsList from "./CommentsList";
import postApi from "./post-api";
import authHelper from "../auth/auth-helper";
import { Link } from "react-router-dom";

export default function Post({ post, userId, token, addComment, removeComment, removePost: remove, removeLike,addLike }) {

    const postedByImage = `${config.API_URL}/users/${post.postedBy._id}/image/?${new Date().getTime()}`;
    const userImageUrl = `${config.API_URL}/users/${userId}/image/?${new Date().getTime()}`;
    const photoUrl = `${config.API_URL}/posts/${post._id}/${post.postedBy._id}/image`;

    const [comment, setComment] = useState('');

    const [liked, setLiked] = useState(false);

    useEffect(() => {
        let isLiked = post.likes.some(like => like._id == userId);
        setLiked(isLiked);
    }, [post])



    function handleChange(e) {
        setComment(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let localUserId = authHelper.getUserId();
            let res = await postApi.createComment({ text: comment }, localUserId, post._id, token);
            addComment(comment, localUserId, post._id);
            setComment('');
        } catch (error) {
            console.log(error);
        }
    }

    async function removePost() {
        try {
            let token = authHelper.getToken();
            let res = await postApi.removePost(userId, post._id, token);
            remove(post._id);
        } catch (error) {
            console.log(error);
        }
    }

    async function addPostLike() {
        try {
            let token = authHelper.getToken();
            let res = await postApi.addLike(userId, post._id, token)
            addLike(post._id,userId)
            setLiked(true);
        } catch (error) {
            console.log(error);
        }
    }

    async function removePostLike() {
        try {
            let token = authHelper.getToken();
            let res = await postApi.removeLike(userId, post._id, token)
            removeLike(post._id,userId)
            setLiked(false);
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="select-none shadow-md mt-4">
            {/* image and name */}
            <div className="flex relative p-2 bg-blue-103 items-center">
                {/* image */}
                <Link to={`/users/${post.postedBy._id}`} className="flex justify-center items-center w-14 mr-2 h-14"><img alt="user" className="rounded-full"  src={postedByImage} /></Link>
                {/* name and date */}
                <div className="flex flex-col justify-start items-start">
                    {/* name */}
                    <span>{post.postedBy.name}</span>
                    {/* date */}
                    <span className="text-sm text-gray-500">{new Date(post.created).toLocaleString()}</span>
                </div>
                {/* delete post for user posts */}
                {
                    authHelper.getUserId() == post.postedBy._id && <MdDeleteOutline onClick={removePost} className="absolute right-4 text-2xl text-red-500 cursor-pointer" />
                }
            </div>

            {/* post and post photo */}
            <div className="px-3 py-5">
                {/* post text */}
                <p>{post.text}</p>
                {/* post image */}
                {
                    post.photo && <div className="h-60 mt-1"><img alt="post"  src={photoUrl} /></div>
                }
            </div>

            {/* likes and comments */}
            <div className="px-3 py-2 flex items-center text-orange-500 text-lg  gap-5">
                {/* likes */}
                {
                    liked && <AiFillHeart onClick={removePostLike} className="text-orange-500 text-2xl cursor-pointer" />
                }
                {
                    !liked && <BiHeart onClick={addPostLike} className="text-orange-500 text-2xl cursor-pointer" />
                }
                <span>{post.likes.length}</span>
                {/* comment */}
                <BiComment className="text-2xl cursor-pointer" />
                <span>{post.comments.length}</span>
            </div>

            {/* hr */}
            <hr />

            {/* write comment */}
            <div>
                <div className="flex items-center py-1">
                    {/* user image */}
                    <Link to={`/users/${userId}`} className="flex w-8 mr-2 h-8"><img alt="profile" className="rounded-full"  src={userImageUrl} /></Link>
                    <form onSubmit={handleSubmit} className="w-full">
                        <input
                            value={comment}
                            onChange={handleChange}
                            required
                            style={{
                                border: "none",
                                borderBottom: "2px solid gray",
                                outline: "none"
                            }} className="border-none mb-2 px-2 w-full"
                            placeholder="Write something"
                        />
                    </form>

                    {/* comments */}
                </div>
                {
                    post.comments.length > 0 && <CommentsList removeComment={removeComment} postId={post._id} userId={userId} comments={post.comments} />
                }

            </div>

        </div>
    )
}