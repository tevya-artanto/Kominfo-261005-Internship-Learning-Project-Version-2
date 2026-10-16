import { useState } from "react";

import mockCats from "../data/mockCats.js";
import CatCard from "../components/CatCard.jsx";
import Pagination from "../components/Pagination.jsx";

function GalleryPage() {

    // stores selected tag
    const [selectedTag, setSelectedTag] = useState("");

    // stores current page
    const [currentPage, setCurrentPage] = useState(1);

    // number of cats shown on one page
    const catsPerPage = 8;


    // gets all available tags
    const allTags = [
        ...new Set(
            mockCats.flatMap((cat) => cat.tags)
        )
    ].sort();


    // filters cats using selected tag
    const filteredCats = selectedTag
        ? mockCats.filter((cat) =>
            cat.tags.includes(selectedTag)
        )
        : mockCats;


    // calculates number of pages
    const totalPages = Math.ceil(
        filteredCats.length / catsPerPage
    );


    // gets cats for current page
    const startIndex =
        (currentPage - 1) * catsPerPage;

    const endIndex =
        startIndex + catsPerPage;

    const currentCats =
        filteredCats.slice(
            startIndex,
            endIndex
        );


    // changes selected tag
    function handleTagChange(event) {

        setSelectedTag(event.target.value);

        // returns to first page when filter changes
        setCurrentPage(1);

    }


    // clears filter
    function handleClearFilter() {

        setSelectedTag("");

        setCurrentPage(1);

    }


    // changes page
    function handlePageChange(pageNumber) {

        if (
            pageNumber >= 1 &&
            pageNumber <= totalPages
        ) {

            setCurrentPage(pageNumber);

        }

    }


    return (
        <div className="page">

            <header>
                <h1>CAT GALLERY</h1>
            </header>


            <main>

                <section className="gallery-heading">

                    <h2>Cats</h2>

                    <p>
                        Browse cats, filter by tag, and open details.
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