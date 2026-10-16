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
    addTextToCat
} from "../services/api.js";


function AddTextPage() {

    const { catId } = useParams();


    const [cat, setCat] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [imageText, setImageText] =
        useState("");

    const [textSize, setTextSize] =
        useState(50);

    const [textColor, setTextColor] =
        useState("#ffffff");


    const [
        generatedImage,
        setGeneratedImage
    ] = useState("");


    const [
        generating,
        setGenerating
    ] = useState(false);


    const [
        generateError,
        setGenerateError
    ] = useState("");


    // loads real cat
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
                        `https://cataas.com/cat/${realId}`
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


    // asks Django to generate image
    async function handleGenerate() {

        if (
            imageText.trim() === ""
        ) {
            return;
        }


        try {

            setGenerating(true);

            setGenerateError("");


            const imageUrl =
                await addTextToCat(
                    cat.id,
                    imageText.trim(),
                    Number(textSize),
                    textColor
                );


            if (!imageUrl) {

                throw new Error(
                    "Backend did not return an image."
                );

            }


            setGeneratedImage(
                imageUrl
            );

        }

        catch (error) {

            console.error(error);

            setGenerateError(
                "Add text backend is not available yet."
            );

        }

        finally {

            setGenerating(false);

        }

    }


    if (loading) {

        return (
            <div className="text-page">

                <p>
                    Loading cat...
                </p>

            </div>
        );

    }


    if (error || !cat) {

        return (
            <div className="text-page">

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
                        src={
                            generatedImage ||
                            cat.image
                        }
                        alt="Cat"
                    />

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
                        setImageText(
                            event.target.value
                        )
                    }
                    placeholder="Enter text"
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
                        setTextSize(
                            event.target.value
                        )
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
                            setTextColor(
                                event.target.value
                            )
                        }
                    />

                    <span>
                        {textColor}
                    </span>

                </div>


                <button
                    type="button"
                    className="dark-button"
                    onClick={handleGenerate}
                    disabled={generating}
                >
                    {generating
                        ? "Generating..."
                        : "Generate image"}
                </button>


                {generateError && (

                    <p className="error-message">
                        {generateError}
                    </p>

                )}

            </div>

        </div>
    );
}


export default AddTextPage;