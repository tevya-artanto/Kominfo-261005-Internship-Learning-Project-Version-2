import { Link } from "react-router-dom";


function CatCard({ cat }) {

    return (
        <Link
            to={`/cats/${cat.id}`}
            className="cat-card-link"
        >

            <article className="cat-card">

                <div className="cat-image">

                    <img
                        src={cat.image}
                        alt="Cat"
                    />

                </div>


                <div className="cat-info">

                    <div className="tags">

                        {cat.tags.map((tag) => (

                            <span key={tag}>
                                {tag}
                            </span>

                        ))}

                    </div>

                </div>

            </article>

        </Link>
    );
}

export default CatCard;