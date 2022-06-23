import config from "../config";
const login = async (user) => {
    try {
        let res = await fetch(`${config.AUTH_URL}/signin`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });
        let data = await res.json();
        if (data.error) {
            throw data;
        }
        return data;
    } catch (error) {
        throw error;
    }
}

const logout = async (cb) => {
    try {
        localStorage.removeItem("user");
        let res = await fetch(`${config.AUTH_URL}/signout`, {
            method: "GET"
        })
        let success = await res.json();
        cb(success);
    } catch (error) {
        console.log(error);
    }
}


export default { login, logout };