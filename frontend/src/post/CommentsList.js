import React from "react";
import Comment from "./Comment";

export default function CommentsList({ comments, userId,postId,removeComment }) {
    return (
        <ul className="mt-2 min-h-fit max-h-60 overflow-y-auto">
            {
                comments.map((comment, index) => <Comment removeComment={removeComment} postId={postId} userId={userId} key={index} comment={comment} />)
            }
        </ul>
    )

}