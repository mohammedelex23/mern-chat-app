import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import authApi from "../auth/auth-api";
import { toggleNav } from "../helpers"
import { AiOutlineHome } from "react-icons/ai";


export default function Navbar({ page, name }) {

    let user = localStorage.getItem("user");
    user = user && JSON.parse(user);
    let localUserId = user && user.user._id;
    let { userId } = useParams();
    const { pathname } = useLocation();

    const navigate = useNavigate();

    const active = (path) => {
        if (pathname == path) {
            return {
                color: "#78ffc5"
            }
        } else {
            return {
                color: "white"
            }
        }
    }

    const logout = async () => {
        toggleNav();
        await authApi.logout(function () {
            return navigate("/");
        })
    }


    return (
        <div className="px-4 py-1 bg-blue-100 text-white">
            <div className="flex justify-between items-center">
                {
                    // back to profile from edit profile
                    userId && page === "edit-profile" && <div className="select-none" onClick={() => navigate(-1)} >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                }
                {
                    // back to Home from profile
                    page === "profile" && <div className="select-none" onClick={() => navigate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                }
                {
                    page === "edit-profile" ? <h1 style={{ color: "#78ffc5" }} className="text-2xl font-bold">Edit Profile</h1>
                        :
                        name && page === "profile" ? <h1 style={{ color: "#78ffc5" }} className="text-lg font-bold">
                            {
                                userId == localUserId ? "Profile" : name
                            }
                        </h1>
                            :
                            <Link reloadDocument={true} style={active("/")} to="/"><h1 className="text-2xl font-bold">Chat</h1></Link>
                }
                <svg onClick={toggleNav} className="cursor-pointer h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </div>
            <ul className="nav-links" id="nav_links">
                {
                    pathname != "/" && <Link className="flex mt-3" to="/">
                        <AiOutlineHome className="mr-1 h-5 w-5" />
                        <li>Home</li>
                    </Link>
                }
                {
                    user && <Link style={active(`/users/${user.user._id}`)} onClick={toggleNav} id="users" className="flex mt-3" to={`/users/${user.user._id}`}>
                        <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <li className="mb-1">Profile</li>
                    </Link>
                }
                {
                    // logout
                    user && <button onClick={logout} id="users" className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <li className="mb-1">Logout</li>
                    </button>
                }
                {
                    !user && <Link style={active("/login")} onClick={toggleNav} id="login" className="flex mt-3" to="/login">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <li className="mb-1">Login</li>
                    </Link>
                }
                {
                    !user && <Link style={active("/signup")} onClick={toggleNav} id="signup" className="flex" to="/signup">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <li className="mb-1">Signup</li>
                    </Link>
                }
            </ul>
        </div>
    );
}