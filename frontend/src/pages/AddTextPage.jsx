import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import mockCats from "../data/mockCats.js";


function AddTextPage() {

    // gets cat ID from URL
    const { catId } = useParams();


    // finds selected cat
    const cat = mockCats.find(
        (cat) => cat.id === catId
    );


    // text settings
    const [imageText, setImageText] =
        useState("I need more snacks");

    const [textSize, setTextSize] =
        useState(50);

    const [textColor, setTextColor] =
        useState("#ffffff");


    // if cat cannot be found
    if (!cat) {

        return (
            <div className="text-page">

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
        <div className="text-page">

            <Link
                to={`/cats/${cat.id}`}
                className="close-button"
            >
                ×
            </Link>


            <div className="text-preview-section">

                <h2>
                    Add text to cat
                </h2>


                <div className="text-cat-image">

                    <img
                        src={cat.image}
                        alt="Cat"
                    />


                    <p
                        className="preview-text"
                        style={{
                            fontSize: `${textSize}px`,
                            color: textColor
                        }}
                    >
                        {imageText.toUpperCase()}
                    </p>

                </div>

            </div>


            <div className="text-settings">

                <h2>
                    Text settings
                </h2>


                <label htmlFor="image-text">
                    Text
                </label>

                <input
                    id="image-text"
                    type="text"
                    value={imageText}
                    onChange={(event) =>
                        setImageText(event.target.value)
                    }
                />


                <label htmlFor="text-size">
                    Text size
                </label>

                <input
                    id="text-size"
                    type="number"
                    min="10"
                    max="100"
                    value={textSize}
                    onChange={(event) =>
                        setTextSize(event.target.value)
                    }
                />


                <label htmlFor="text-color">
                    Text colour
                </label>

                <div className="color-row">

                    <input
                        id="text-color"
                        type="color"
                        value={textColor}
                        onChange={(event) =>
                            setTextColor(event.target.value)
                        }
                    />

                    <span>
                        {textColor}
                    </span>

                </div>

            </div>

        </div>
    );
}

export default AddTextPage;