import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    getCat,
    getComments,
    postComment
} from "../services/api.js";

import CommentList
    from "../components/CommentList.jsx";

import CommentForm
    from "../components/CommentForm.jsx";


function CatDetailsPage() {

    const { catId } =
        useParams();


    const [cat, setCat] =
        useState(null);

    const [comments, setComments] =
        useState([]);


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        commentError,
        setCommentError
    ] = useState("");


    // loads only selected cat
    useEffect(() => {

        async function loadCat() {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getCat(catId);


                setCat({

                    id:
                        data.id ||
                        data._id ||
                        catId,

                    image:
                        data.image_url ||
                        data.image ||
                        `https://cataas.com/cat/${catId}`,

                    tags:
                        data.tags || []

                });

            }
            catch (error) {

                console.error(error);

                setError(
                    "Could not load this cat from Django."
                );

            }
            finally {

                setLoading(false);

            }

        }


        loadCat();

    }, [catId]);


    // loads comments for this cat only
    useEffect(() => {

        async function loadComments() {

            try {

                const data =
                    await getComments(
                        catId
                    );


                setComments(

                    Array.isArray(data)
                        ? data
                        : (
                            data.results ??
                            []
                        )

                );


                setCommentError("");

            }
            catch (error) {

                console.error(error);

                setComments([]);

                setCommentError(
                    "Could not load comments for this cat."
                );

            }

        }


        loadComments();

    }, [catId]);


    async function handleAddComment(
        username,
        content
    ) {

        try {

            setCommentError("");


            await postComment(
                catId,
                username,
                content
            );


            const updatedComments =
                await getComments(
                    catId
                );


            setComments(

                Array.isArray(
                    updatedComments
                )
                    ? updatedComments
                    : (
                        updatedComments.results ??
                        []
                    )

            );

        }
        catch (error) {

            console.error(error);

            setCommentError(
                "Could not save comment."
            );

            throw error;

        }

    }


    if (loading) {

        return (
            <div className="details-page">

                <p>
                    Loading cat...
                </p>

            </div>
        );

    }


    if (error || !cat) {

        return (
            <div className="details-page">

                <h2>
                    {error || "Cat not found"}
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

                        {cat.tags.length > 0
                            ? cat.tags.map(
                                (tag) => (

                                    <span key={tag}>
                                        {tag}
                                    </span>

                                )
                            )
                            : (
                                <p>
                                    No tags returned by backend
                                </p>
                            )
                        }

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


                {commentError && (

                    <p className="error-message">
                        {commentError}
                    </p>

                )}


                {!commentError && (

                    <CommentList
                        comments={comments}
                    />

                )}


                <h3>
                    Add comment
                </h3>


                <CommentForm
                    onAddComment={
                        handleAddComment
                    }
                />

            </div>

        </div>
    );
}


export default CatDetailsPage;