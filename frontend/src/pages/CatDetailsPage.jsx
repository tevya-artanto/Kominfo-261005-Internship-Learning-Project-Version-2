import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import mockCats from "../data/mockCats.js";

import CommentList from "../components/CommentList.jsx";
import CommentForm from "../components/CommentForm.jsx";


function CatDetailsPage() {

    // gets cat ID from URL
    const { catId } = useParams();


    // finds selected cat
    const cat = mockCats.find(
        (cat) => cat.id === catId
    );


    // temporary comments
    const [comments, setComments] = useState([]);


    // adds new comment
    function handleAddComment(newComment) {

        setComments([
            ...comments,
            newComment
        ]);

    }


    // if cat cannot be found
    if (!cat) {

        return (
            <div className="details-page">

                <h2>
                    Cat not found
                </h2>

                <Link to="/">
                    Back to gallery
                </Link>

            </div>
        );

    }


    return (
        <div className="details-page">

            <Link
                to="/"
                className="close-button"
            >
                ×
            </Link>


            <div className="details-image-section">

                <div className="large-cat-image">

                    <img
                        src={cat.image}
                        alt="Cat"
                    />

                </div>


                <Link
                    to={`/cats/${cat.id}/add-text`}
                    className="dark-button add-text-link"
                >
                    Add text to image
                </Link>

            </div>


            <div className="details-info">

                <h2>
                    Cat details
                </h2>


                <div className="details-row">

                    <strong>
                        Tags
                    </strong>

                    <div className="tags">

                        {cat.tags.map((tag) => (

                            <span key={tag}>
                                {tag}
                            </span>

                        ))}

                    </div>

                </div>


                <div className="details-row">

                    <strong>
                        ID
                    </strong>

                    <p>
                        {cat.id}
                    </p>

                </div>


                <div className="details-row">

                    <strong>
                        Comments
                    </strong>

                    <p>
                        {comments.length}
                    </p>

                </div>


                <CommentList
                    comments={comments}
                />


                <h3>
                    Add comment
                </h3>


                <CommentForm
                    onAddComment={handleAddComment}
                />

            </div>

        </div>
    );
}

export default CatDetailsPage;