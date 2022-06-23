import React from "react";
import Post from "./Post";


export default function PostsList({ posts, userId, token, addComment, removeComment, removePost,addLike,removeLike }) {


    return (
        <div className="">
            {
                posts.map((post, index) => <Post removeLike={removeLike} addLike={addLike} rem removePost={removePost} removeComment={removeComment} addComment={addComment} token={token} userId={userId} post={post} key={index} />)
            }
        </div>
    )
}