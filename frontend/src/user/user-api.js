import config from "../config";
const create = async (user) => {
    try {
        let res = await fetch(`${config.API_URL}/users`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });
        res = await res.json();
        if (res.error) {
            throw res;
        }
        return true;
    } catch (error) {
        throw error;
    }
}

const read = async (token, userId, signal) => {
    try {
        let res = await fetch(`${config.API_URL}/users/${userId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            signal
        })
        res = await res.json();
        if (res.error) {
            throw res;
        }
        return res;
    } catch (error) {
        throw error;
    }
}

const list = async (signal) => {
    try {
        let res = await fetch(`${config.API_URL}/users`, {
            method: "GET",
            signal
        });
        res = await res.json();
        if (res.error) {
            throw res;
        }
        return res;
    } catch (error) {
        throw "Something went wrong";
    }
}

const update = async (user, userId, token) => {
    try {
        let res = await fetch(`${config.API_URL}/users/${userId}`, {
            method: "PUT",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: user
        })
        res = await res.json();
        if (res.error) {
            throw res.errors;
        }
        return res;
    } catch (error) {
        throw error;
    }
}

const remove = async (userId, token) => {
    try {
        let res = await fetch(`${config.API_URL}/users/${userId}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        res = await res.json();
        if (res.error) {
            throw res;
        }
        return res;
    } catch (error) {
        throw error;
    }
}


const peoplesToFollow = async (userId, signal) => {
    try {
        let res = await fetch(`${config.API_URL}/users/findpeople/${userId}`, {
            method: "GET",
            signal
        })
        res = await res.json();
        if (res.error) {
            throw res;
        }
        return res;
    } catch (error) {
        throw error;
    }
}

const follow = async (obj, token) => {
    try {
        let res = await fetch(`${config.API_URL}/users/follow`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(obj)
        })
        res = await res.json();
        if (res.error) {
            throw res;
        }
        return res;
    } catch (error) {
        throw error;
    }
}

const unfollow = async (obj, token) => {
    try {
        let res = await fetch(`${config.API_URL}/users/unfollow`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(obj)
        })
        res = await res.json();
        if (res.error) {
            throw res;
        }
        return res;
    } catch (error) {
        throw error;
    }
}

const userApi = { create, read, list, update, remove, peoplesToFollow, follow, unfollow };

export default userApi;