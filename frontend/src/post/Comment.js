import React from "react";
import { MdDeleteOutline } from 'react-icons/md'
import { Link } from "react-router-dom";
import config from "../config";
import authHelper from "../auth/auth-helper";
import postApi from "./post-api";

export default function Comment({ comment, postId, removeComment: remove }) {


    const imageUrl = `${config.API_URL}/users/${comment.postedBy._id}/image/?${new Date().getTime()}`

    async function removeComment() {
        try {
            let token = authHelper.getToken();
            let localUserId = authHelper.getUserId();
            let res = await postApi.removeComment(localUserId, postId, comment._id, token);
            remove(postId, comment._id);
        } catch (error) {
            console.log(error);
            // window.location.reload();
        }
    }

    return (
        <li className="flex bg-gray-400 p-2 items-center">
            {/* commented by image */}
            <Link to={`/users/${comment.postedBy._id}`} className="flex w-12 h-12 mr-3"><img className="rounded-full" crossOrigin="anonymous" src={imageUrl} /></Link>

            {/* text and date */}
            <div className="flex flex-col px-2 bg-white w-full items-start justify-start">
                {/* text */}
                <p>{comment.text}</p>
                {/* date and delete for comment author */}
                <div className="flex items-center">
                    {/* date */}
                    <span className="text-xs">{new Date(comment.created).toLocaleString()}</span>
                    {/* delete */}
                    {
                        authHelper.getUserId() == comment.postedBy._id && <MdDeleteOutline onClick={removeComment} className="ml-1 text-red-500 cursor-pointer" />
                    }
                </div>
            </div>
        </li>
    )
}