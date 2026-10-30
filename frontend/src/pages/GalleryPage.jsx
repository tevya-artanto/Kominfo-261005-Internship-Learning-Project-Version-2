import { useEffect, useState } from "react";

import {
    getCats,
    getTags
} from "../services/api.js";

import CatCard from "../components/CatCard.jsx";
import Pagination from "../components/Pagination.jsx";


function GalleryPage() {

    const [cats, setCats] = useState([]);
    const [tags, setTags] = useState([]);

    const [selectedTag, setSelectedTag] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalCats, setTotalCats] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [tagError, setTagError] =
        useState("");

    const catsPerPage = 8;


    // loads tags from Django
    useEffect(() => {

        async function loadTags() {

            try {

                const data = await getTags();

                setTags(
                    [...new Set(data)].sort()
                );

                setTagError("");

            }
            catch (error) {

                console.error(error);

                setTags([]);

                setTagError(
                    "Could not load tags from Django."
                );

            }

        }

        loadTags();

    }, []);


    // loads only current page from Django
    useEffect(() => {

        async function loadCats() {

            try {

                setLoading(true);
                setError("");

                const data = await getCats(
                    currentPage,
                    catsPerPage,
                    selectedTag
                );

                const formattedCats =
                    data.results.map((cat) => {

                        const catId =
                            cat._id || cat.id;

                        return {

                            id: catId,

                            image:
                                cat.image_url ||
                                cat.image ||
                                `https://cataas.com/cat/${catId}`,

                            tags:
                                cat.tags || []

                        };

                    });

                setCats(formattedCats);

                setTotalCats(
                    data.count
                );

            }
            catch (error) {

                console.error(error);

                setCats([]);
                setTotalCats(0);

                setError(
                    "Could not load cats from Django."
                );

            }
            finally {

                setLoading(false);

            }

        }

        loadCats();

    }, [currentPage, selectedTag]);


    const totalPages = Math.max(
        1,
        Math.ceil(
            totalCats / catsPerPage
        )
    );


    function handleTagChange(event) {

        setSelectedTag(
            event.target.value
        );

        setCurrentPage(1);

    }


    function handleClearFilter() {

        setSelectedTag("");
        setCurrentPage(1);

    }


    function handlePageChange(pageNumber) {

        if (
            pageNumber >= 1 &&
            pageNumber <= totalPages
        ) {

            setCurrentPage(
                pageNumber
            );

        }

    }


    return (
        <div className="page">

            <header>
                <h1>
                    CAT GALLERY
                </h1>
            </header>


            <main>

                <section className="gallery-heading">

                    <h2>
                        Cats
                    </h2>

                    <p>
                        Browse cats, filter by tag,
                        and open details.
                    </p>

                </section>


                <section className="filter-box">

                    <div className="filter-left">

                        <label htmlFor="tag-filter">
                            Filter by tag
                        </label>

                        <select
                            id="tag-filter"
                            value={selectedTag}
                            onChange={handleTagChange}
                            disabled={tags.length === 0}
                        >

                            <option value="">
                                Select tag
                            </option>

                            {tags.map((tag) => (

                                <option
                                    key={tag}
                                    value={tag}
                                >
                                    {tag}
                                </option>

                            ))}

                        </select>

                    </div>


                    <button
                        className="clear-filter"
                        onClick={handleClearFilter}
                    >
                        Clear filter
                    </button>

                </section>


                {tagError && (

                    <p className="error-message">
                        {tagError}
                    </p>

                )}


                <p className="showing-text">

                    Showing {cats.length} of {totalCats} cats

                </p>


                {loading && (

                    <p>
                        Loading cats...
                    </p>

                )}


                {error && !loading && (

                    <p className="error-message">
                        {error}
                    </p>

                )}


                {!loading && !error && (

                    <>

                        <section className="cat-grid">

                            {cats.map((cat) => (

                                <CatCard
                                    key={cat.id}
                                    cat={cat}
                                />

                            ))}

                        </section>


                        {totalPages > 1 && (

                            <Pagination

                                currentPage={
                                    currentPage
                                }

                                totalPages={
                                    totalPages
                                }

                                onPageChange={
                                    handlePageChange
                                }

                            />

                        )}

                    </>

                )}

            </main>

        </div>
    );
}


export default GalleryPage;