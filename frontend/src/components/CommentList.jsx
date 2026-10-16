function CommentList({ comments }) {

    if (comments.length === 0) {
        return (
            <p className="no-comments">
                No comments yet.
            </p>
        );
    }

    return (
        <div className="comment-list">

            {comments.map((comment) => (

                <div
                    className="comment-item"
                    key={comment.id}
                >

                    <strong>
                        {comment.username}
                    </strong>

                    <p>
                        {comment.content}
                    </p>

                </div>

            ))}

        </div>
    );
}

export default CommentList;