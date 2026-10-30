import { useState } from "react";


function CommentForm({
    onAddComment
}) {

    const [username, setUsername] =
        useState("");

    const [comment, setComment] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);


    async function handleSubmit(event) {

        event.preventDefault();


        if (
            username.trim() === "" ||
            comment.trim() === ""
        ) {
            return;
        }


        try {

            setSubmitting(true);


            await onAddComment(
                username.trim(),
                comment.trim()
            );


            setUsername("");
            setComment("");

        }
        finally {

            setSubmitting(false);

        }

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
                    setUsername(
                        event.target.value
                    )
                }

                placeholder="Enter username"
            />


            <label>
                Comment
            </label>

            <textarea
                value={comment}

                onChange={(event) =>
                    setComment(
                        event.target.value
                    )
                }

                placeholder="Write a comment..."
            />


            <button
                type="submit"
                className="dark-button"
                disabled={submitting}
            >

                {submitting
                    ? "Posting..."
                    : "Post comment"}

            </button>

        </form>
    );
}


export default CommentForm;