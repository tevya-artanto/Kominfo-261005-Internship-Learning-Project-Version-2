function Pagination({
    currentPage,
    totalPages,
    onPageChange
}) {

    function getVisiblePages() {

        if (totalPages <= 7) {

            return Array.from(
                {
                    length: totalPages
                },
                (_, index) =>
                    index + 1
            );

        }


        const pages = [1];


        if (currentPage > 4) {

            pages.push(
                "left-ellipsis"
            );

        }


        const start = Math.max(
            2,
            currentPage - 1
        );


        const end = Math.min(
            totalPages - 1,
            currentPage + 1
        );


        for (
            let page = start;
            page <= end;
            page += 1
        ) {

            pages.push(page);

        }


        if (
            currentPage <
            totalPages - 3
        ) {

            pages.push(
                "right-ellipsis"
            );

        }


        pages.push(
            totalPages
        );


        return pages;

    }


    return (
        <nav className="pagination">

            <button
                onClick={() =>
                    onPageChange(
                        currentPage - 1
                    )
                }
                disabled={
                    currentPage === 1
                }
            >
                ‹ Previous
            </button>


            {getVisiblePages().map(
                (item) => {

                    if (
                        typeof item ===
                        "string"
                    ) {

                        return (
                            <span
                                key={item}
                                className="pagination-ellipsis"
                            >
                                …
                            </span>
                        );

                    }


                    return (
                        <button
                            key={item}

                            onClick={() =>
                                onPageChange(
                                    item
                                )
                            }

                            className={
                                currentPage === item
                                    ? "active-page"
                                    : ""
                            }
                        >
                            {item}
                        </button>
                    );

                }
            )}


            <button
                onClick={() =>
                    onPageChange(
                        currentPage + 1
                    )
                }
                disabled={
                    currentPage ===
                    totalPages
                }
            >
                Next ›
            </button>

        </nav>
    );
}


export default Pagination;