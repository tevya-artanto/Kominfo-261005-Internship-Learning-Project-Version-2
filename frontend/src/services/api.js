const API_URL = "http://127.0.0.1:8000";


// gets real cats from Django
export async function getCats() {

    const response = await fetch(
        `${API_URL}/`
    );

    if (!response.ok) {
        throw new Error("Could not load cats");
    }

    return response.json();
}


// gets comments for one cat
export async function getComments(catId) {

    const response = await fetch(
        `${API_URL}/api/cats/${catId}/comments/`
    );

    if (!response.ok) {
        throw new Error("Could not load comments");
    }

    return response.json();
}


// posts comment to Django
export async function postComment(
    catId,
    username,
    content
) {

    const response = await fetch(
        `${API_URL}/api/cats/${catId}/comments/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                content: content
            })
        }
    );

    if (!response.ok) {
        throw new Error("Could not post comment");
    }

    return response.json();
}


// sends text settings to Django
export async function addTextToCat(
    catId,
    text,
    size,
    color
) {

    const response = await fetch(
        `${API_URL}/api/cats/${catId}/says/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text,
                size: size,
                color: color
            })
        }
    );

    if (!response.ok) {
        throw new Error("Could not generate image");
    }


    const contentType =
        response.headers.get("content-type");


    // if Django returns JSON
    if (
        contentType &&
        contentType.includes(
            "application/json"
        )
    ) {

        const data = await response.json();

        return (
            data.image_url ||
            data.image ||
            data.url
        );

    }


    // if Django returns an image directly
    const imageBlob =
        await response.blob();

    return URL.createObjectURL(
        imageBlob
    );
}