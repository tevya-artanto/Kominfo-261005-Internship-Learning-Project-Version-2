import { useState } from "react";


function CommentForm({ onAddComment }) {

    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");


    function handleSubmit(event) {

        event.preventDefault();


        if (
            username.trim() === "" ||
            comment.trim() === ""
        ) {
            return;
        }


        const newComment = {
            id: Date.now(),
            username: username,
            content: comment
        };


        onAddComment(newComment);


        setUsername("");
        setComment("");
    }


    return (
        <form
            className="comment-form"
            onSubmit={handleSubmit}
        >

            <label>
                Username
            </label>

            <input
                type="text"
                value={username}
                onChange={(event) =>
                    setUsername(event.target.value)
                }
                placeholder="Enter username"
            />


            <label>
                Comment
            </label>

            <textarea
                value={comment}
                onChange={(event) =>
                    setComment(event.target.value)
                }
                placeholder="Write a comment..."
            />


            <button
                type="submit"
                className="dark-button"
            >
                Post comment
            </button>

        </form>
    );
}

export default CommentForm;