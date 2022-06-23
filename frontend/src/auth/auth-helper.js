import jwt from 'jwt-decode';


function getLocalUser() {
    let user = localStorage.getItem("user");
    user = user && JSON.parse(user);
    return user;
}

function getToken() {
    let user = localStorage.getItem("user");
    let token = user && JSON.parse(user).token;
    return token;
}

function getUserId() {
    let user = localStorage.getItem("user");
    let userId = user && JSON.parse(user).user._id;
    return userId
}

function authenticate(user, cb) {
    localStorage.setItem("user", JSON.stringify(user));
    cb();
}

function isAuthenticated() {
    if (typeof window == "undefined")
        return false;

    let localInfo = localStorage.getItem('user');
    localInfo = localInfo && JSON.parse(localInfo);

    let token = localInfo && localInfo.token;

    let validToken = true;

    try {
        let decoded = jwt(token);
        if (decoded.exp < Date.now() / 1000) {
            validToken = false;
        }
    } catch (error) {
        validToken = false;
    }


    if (!validToken) {
        localStorage.removeItem('user');
        localInfo = '';
    }

    if (localInfo && validToken) {
        return localInfo
    }
    else
        return false
}

export default { isAuthenticated, authenticate, getLocalUser, getToken, getUserId }