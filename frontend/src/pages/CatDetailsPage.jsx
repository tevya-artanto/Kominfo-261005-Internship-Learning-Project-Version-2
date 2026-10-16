import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    getCats,
    getComments,
    postComment
} from "../services/api.js";

import CommentList
    from "../components/CommentList.jsx";

import CommentForm
    from "../components/CommentForm.jsx";


function CatDetailsPage() {

    const { catId } = useParams();


    const [cat, setCat] =
        useState(null);

    const [comments, setComments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [commentError, setCommentError] =
        useState("");


    // gets selected cat
    useEffect(() => {

        async function loadCat() {

            try {

                const data =
                    await getCats();


                const selectedCat =
                    data.find(
                        (item) =>
                            item.id === catId ||
                            item._id === catId
                    );


                if (!selectedCat) {

                    setError(
                        "Cat not found"
                    );

                    return;

                }


                const realId =
                    selectedCat.id ||
                    selectedCat._id;


                setCat({
                    id: realId,

                    image:
                        `https://cataas.com/cat/${realId}`,

                    tags:
                        selectedCat.tags || []
                });

            }

            catch (error) {

                console.error(error);

                setError(
                    "Could not load cat."
                );

            }

            finally {

                setLoading(false);

            }

        }


        loadCat();

    }, [catId]);


    // gets comments from Django
    useEffect(() => {

        async function loadComments() {

            try {

                const data =
                    await getComments(
                        catId
                    );

                setComments(data);

                setCommentError("");

            }

            catch (error) {

                console.error(error);

                setComments([]);

                setCommentError(
                    "Comments backend is not available yet."
                );

            }

        }


        loadComments();

    }, [catId]);


    // sends comment to Django
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


            // reloads comments from database
            const updatedComments =
                await getComments(
                    catId
                );


            setComments(
                updatedComments
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
                                    No tags
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