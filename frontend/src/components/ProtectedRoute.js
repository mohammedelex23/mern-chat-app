import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import authHelper from "../auth/auth-helper";
import Home from "./Home";
import Landing from "./Landing";


export default function ProtectedRoute({ children, type, path }) {
    let { userId } = useParams();
    const { pathname } = useLocation();


    if (authHelper.isAuthenticated() && path === "/") {
        return <Home />
    }
    if (!authHelper.isAuthenticated() && path === "/") {
        return <Landing />
    }
    if (authHelper.isAuthenticated() && type === "spectial") {
        const localUser = authHelper.getLocalUser();
        return <Navigate to={`/users/${localUser.user._id}`} />
    }
    if (!authHelper.isAuthenticated() && type !== "spectial") {
        return <Navigate to="/login" replace state={pathname} />
    }
    else {
        return children;
    }

}