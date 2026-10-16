import { useEffect, useState } from "react";

import { getCats } from "../services/api.js";

import CatCard from "../components/CatCard.jsx";
import Pagination from "../components/Pagination.jsx";


function GalleryPage() {

    // stores cats from Django
    const [cats, setCats] = useState([]);

    // stores selected tag
    const [selectedTag, setSelectedTag] =
        useState("");

    // stores current page
    const [currentPage, setCurrentPage] =
        useState(1);

    // loading message
    const [loading, setLoading] =
        useState(true);

    // error message
    const [error, setError] =
        useState("");


    const catsPerPage = 8;


    // gets real cats from Django
    useEffect(() => {

        async function loadCats() {

            try {

                const data = await getCats();

                // converts CatAAS data into the format
                // used by our React components
                const formattedCats = data.map((cat) => {

                    const catId =
                        cat._id || cat.id;

                    return {
                        id: catId,

                        image:
                            `https://cataas.com/cat/${catId}`,

                        tags:
                            cat.tags || []
                    };

                });


                setCats(formattedCats);

            }

            catch (error) {

                console.error(error);

                setError(
                    "Could not load cats from Django."
                );

            }

            finally {

                setLoading(false);

            }

        }


        loadCats();

    }, []);


    // creates tag list from real cat data
    const allTags = [
        ...new Set(
            cats.flatMap(
                (cat) => cat.tags
            )
        )
    ].sort();


    // filters cats
    const filteredCats = selectedTag
        ? cats.filter((cat) =>
            cat.tags.includes(selectedTag)
        )
        : cats;


    // number of pages
    const totalPages = Math.ceil(
        filteredCats.length / catsPerPage
    );


    // cats for current page
    const startIndex =
        (currentPage - 1) * catsPerPage;

    const endIndex =
        startIndex + catsPerPage;

    const currentCats =
        filteredCats.slice(
            startIndex,
            endIndex
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

            setCurrentPage(pageNumber);

        }

    }


    if (loading) {

        return (
            <div className="page">

                <main>
                    <p>
                        Loading cats...
                    </p>
                </main>

            </div>
        );

    }


    if (error) {

        return (
            <div className="page">

                <main>
                    <p>
                        {error}
                    </p>
                </main>

            </div>
        );

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
                        >

                            <option value="">
                                Select tag
                            </option>


                            {allTags.map((tag) => (

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


                <p className="showing-text">
                    Showing {filteredCats.length} cats
                </p>


                <section className="cat-grid">

                    {currentCats.map((cat) => (

                        <CatCard
                            key={cat.id}
                            cat={cat}
                        />

                    ))}

                </section>


                {totalPages > 1 && (

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />

                )}

            </main>

        </div>
    );
}


export default GalleryPage;