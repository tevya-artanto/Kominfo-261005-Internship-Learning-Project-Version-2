const API_URL = "http://127.0.0.1:8000";


// gets one page of cats from Django
export async function getCats(
    page = 1,
    limit = 8,
    tag = ""
) {

    const offset = (page - 1) * limit;

    const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset)
    });

    if (tag) {
        params.set("tag", tag);
    }

    const response = await fetch(
        `${API_URL}/api/cats/?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            `Could not load cats (${response.status})`
        );
    }

    const data = await response.json();

    // supports Django pagination response
    if (Array.isArray(data)) {
        return {
            count: data.length,
            results: data
        };
    }

    return {
        count: data.count ?? 0,
        results: data.results ?? []
    };
}


// gets tags from Django
export async function getTags() {

    const response = await fetch(
        `${API_URL}/api/tags/`
    );

    if (!response.ok) {
        throw new Error(
            `Could not load tags (${response.status})`
        );
    }

    const data = await response.json();

    return Array.isArray(data)
        ? data
        : (data.tags ?? []);
}


// gets one cat from Django
// your friend's current backend uses POST
export async function getCat(catId) {

    const response = await fetch(
        `${API_URL}/api/cats/${catId}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error(
            `Could not load cat (${response.status})`
        );
    }

    return response.json();
}


// gets comments for one cat
export async function getComments(catId) {

    const response = await fetch(
        `${API_URL}/api/cats/${catId}/comments/`
    );

    if (!response.ok) {
        throw new Error(
            `Could not load comments (${response.status})`
        );
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
                catID: catId,
                username: username,
                content: content
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            `Could not post comment (${response.status})`
        );
    }

    const contentType =
        response.headers.get("content-type");

    if (
        contentType &&
        contentType.includes("application/json")
    ) {
        return response.json();
    }

    return null;
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
        throw new Error(
            `Could not generate image (${response.status})`
        );
    }

    const contentType =
        response.headers.get("content-type");

    if (
        contentType &&
        contentType.includes("application/json")
    ) {

        const data = await response.json();

        return (
            data.image_url ||
            data.image ||
            data.url
        );
    }

    const imageBlob = await response.blob();

    return URL.createObjectURL(imageBlob);
}