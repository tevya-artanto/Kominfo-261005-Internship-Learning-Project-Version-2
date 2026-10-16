// Django backend URL
const API_URL = "http://127.0.0.1:8000";


// gets cats from Django
export async function getCats(page = 1, limit = 8, tag = "") {

    let url =
        `${API_URL}/api/cats/?page=${page}&limit=${limit}`;

    if (tag !== "") {
        url += `&tag=${encodeURIComponent(tag)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not load cats");
    }

    return response.json();
}


// gets tags from Django
export async function getTags() {

    const response = await fetch(
        `${API_URL}/api/tags/`
    );

    if (!response.ok) {
        throw new Error("Could not load tags");
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


// posts a comment
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


// sends add-text settings to Django
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

    return response.json();
}