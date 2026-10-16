function Pagination({
    currentPage,
    totalPages,
    onPageChange
}) {

    return (
        <nav className="pagination">

            <button
                onClick={() =>
                    onPageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
            >
                ‹ Previous
            </button>


            {Array.from(
                { length: totalPages },
                (_, index) => index + 1
            ).map((pageNumber) => (

                <button
                    key={pageNumber}
                    onClick={() =>
                        onPageChange(pageNumber)
                    }
                    className={
                        currentPage === pageNumber
                            ? "active-page"
                            : ""
                    }
                >
                    {pageNumber}
                </button>

            ))}


            <button
                onClick={() =>
                    onPageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
            >
                Next ›
            </button>

        </nav>
    );
}

export default Pagination;