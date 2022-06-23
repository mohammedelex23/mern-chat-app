import config from "../config"


const allPosts = async (userId, token, signal) => {
    try {
        let res = await fetch(`${config.API_URL}/posts/all/${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            signal
        })

        res = await res.json();

        if (res.error) {
            throw res
        }

        return res;
    } catch (error) {
        throw error
    }
}

const getPost = async (postId) => {
    try {
        let res = await fetch(`${config.API_URL}/posts/one/${postId}`, {
            method: 'GET'
        })

        res = await res.json();

        if (res.error) {
            throw res
        }

        return res;
    } catch (error) {
        throw error
    }
}

const createPost = async (post, userId, token) => {
    try {
        let res = await fetch(`${config.API_URL}/posts/new/${userId}`, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: post
        });

        res = await res.json();

        if (res.error) {
            throw res
        }

        return res;
    } catch (error) {
        throw error
    }
}

const removePost = async (userId, postId, token) => {
    try {
        let res = await fetch(`${config.API_URL}/posts/${postId}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        res = await res.json();

        if (res.error) {
            throw res
        }

        return res;
    } catch (error) {
        throw error
    }
}

const createComment = async (comment, userId, postId, token) => {
    try {
        let res = await fetch(`${config.API_URL}/posts/${postId}/${userId}/comments`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(comment)
        });

        res = await res.json();

        if (res.error) {
            throw res
        }

        return res;
    } catch (error) {
        throw error
    }
}

const removeComment = async (userId, postId, commentId, token) => {
    try {
        let res = await fetch(`${config.API_URL}/posts/${postId}/${userId}/comments/remove/${commentId}`, {
            method: "PUT",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        res = await res.json();

        if (res.error) {
            throw res
        }

        return res;

    } catch (error) {
        throw error
    }
}

const addLike = async (userId, postId, token) => {
    try {
        let res = await fetch(`${config.API_URL}/posts/${postId}/${userId}/likes/add`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        res = await res.json();

        if (res.error) {
            throw res
        }

        return res;
    } catch (error) {
        throw error;
    }
}

const removeLike = async (userId, postId, token) => {
    try {
        let res = await fetch(`${config.API_URL}/posts/${postId}/${userId}/likes/remove`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        res = await res.json();

        if (res.error) {
            throw res
        }

        return res;
    } catch (error) {
        throw error;
    }
}

const getUserPosts = async (userId, token, signal) => {
    try {
        let res = await fetch(`${config.API_URL}/posts/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            signal
        })

        res = await res.json();

        if (res.error) {
            throw res
        }

        return res;
    } catch (error) {
        throw error;
    }
}

const postApi = {
    allPosts, createPost, removePost,
    createComment, removeComment, getPost,
    addLike, removeLike, getUserPosts
}
export default postApi;
