import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import userApi from "./user-api";
import { hideNav } from "../helpers";
import Navbar from "../components/Navbar";
import GeneralError from "../components/GeneralError";
import Modal from "../components/Modal";
import authApi from "../auth/auth-api";
import config from "../config";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md"
import Posts from "../post/Posts";

export default function Profile() {

    const navigate = useNavigate();
    const { pathname } = useLocation();


    const [user, setUser] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { userId } = useParams();
    const [userIsRemoved, setUserIsRemoved] = useState(false);
    const [open, setOpen] = useState(false);



    const localInfo = JSON.parse(localStorage.getItem('user'));
    const localUser = localInfo && localInfo.user;
    const token = localInfo && localInfo.token;
    const imageUrl = `${config.API_URL}/users/${userId}/image/?${new Date().getTime()}`
    useEffect(() => {

        //change style
        let first = document.getElementById('first')
        let posts = document.getElementById("posts");
        let followings = document.getElementById("followings");
        let followers = document.getElementById("followers");
        let underline = document.getElementById("underline");

        if (first && posts && followings && followers && underline) {
            first.style.marginLeft = "0";

            followings.style.color = "#9ca3af";
            followers.style.color = "#9ca3af"
            posts.style.color = "#242f9b"

            underline.style.marginLeft = "0";

        }


        let abortController = new AbortController()
        let signal = abortController.signal;

        getProfile(token, userId, signal);


        return () => {
            abortController.abort();
        }
    }, [userId,token]);

    async function getProfile(token, userId, signal) {
        try {
            setIsLoading(true);
            setError('');
            let res = await userApi.read(token, userId, signal);
            setUser(res.user);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setUser(null);
            if (error.type === "authError") {
                setError("You are not authorized please login")
            } else {
                setError(error.message)
            }
        }
    }

    const openDialog = () => {
        setOpen(true);
    }
    const closeDialog = () => {
        setOpen(false);
    }

    const removeUser = async () => {
        hideNav();
        setOpen(false);
        try {
            setError('');
            setUserIsRemoved(false);
            let removed = await userApi.remove(userId, token);
            if (removed) {
                await authApi.logout(function () {
                    setUserIsRemoved(true);
                    setTimeout(() => {
                        setUserIsRemoved(false);
                        return navigate("/");

                    }, 4000);
                })
            }
        } catch (error) {
            setUserIsRemoved(false);
            setError(error.message);
        }
    }


    // follow and unfollow events
    const follow = (userId, followingId, token) => async () => {
        hideNav();
        try {
            setError('');
            let obj = {
                userId: userId || undefined,
                followingId: followingId || undefined
            }
            let res = await userApi.follow(obj, token);
            setUser(res);
        } catch (error) {
            setUser('');
            setError(error.message);
        }
    }

    const unfollow = (userId, followingId, token) => async () => {
        hideNav();
        try {
            setError('');
            let obj = {
                userId: userId || undefined,
                followingId: followingId || undefined
            }
            let res = await userApi.unfollow(obj, token);
            setUser(res);
        } catch (error) {
            setUser('');
            setError(error.message);
        }
    }

    return (
        <div>
            {
                !user && <Navbar pathname={pathname} page="profile" />
            }
            {
                !userIsRemoved && <div>
                    {
                        user && <Navbar pathname={pathname} name={user.name} page="profile" />
                    }
                    {
                        error && <GeneralError error={error} />
                    }
                    {
                        isLoading && !user && <div className="text-center mt-4">Loading...</div>
                    }
                    {
                        user && <div>
                            <div className="p-3 m-2 shadow-md">

                                <div className="flex justify-between items-center">
                                    {/* profile image */}
                                    <div className="flex w-14 h-14">
                                        <img alt="profile" className="rounded-full" src={imageUrl} />
                                    </div>

                                    {/* name and email */}
                                    {
                                        localUser && localUser._id === user._id && <div className="-ml-6">
                                            <h1 className="" >{user.name}</h1>
                                            <p className="-mt-2 text-gray-500">{user.email}</p>
                                        </div>
                                    }
                                    {
                                        localUser && localUser._id !== user._id &&
                                        <div className="mr-16">
                                            <h1 className="" >{user.name}</h1>
                                            <p className="-mt-2 text-gray-500">{user.email}</p>
                                        </div>
                                    }
                                    {
                                        // edit and remove for local user
                                        localUser && localUser._id === user._id && <div className="flex gap-4 items-center text-2xl justify-between">
                                            <Link onClick={hideNav} to={`/users/${user._id}/edit`}><MdModeEditOutline /></Link>
                                            <MdDeleteOutline onClick={openDialog} color="red" />
                                        </div>
                                    }
                                </div>
                                {
                                    // follow button
                                    localUser && localUser._id != user._id && <div>
                                        {
                                            localUser && user.followers.some(o => o._id == localUser._id) ?
                                                <button onClick={unfollow(localUser._id, user._id, token)} className="flex mx-auto bg-gray-300 uppercase px-4 py-1 text-sm">unfollow</button>
                                                :
                                                <button onClick={follow(localUser._id, user._id, token)} className="flex mx-auto bg-blue-100 uppercase text-white px-4 py-1 text-sm">follow</button>
                                        }
                                    </div>
                                }

                                {/* hr */}
                                <hr className="mt-3" color="#ffffff" />

                                {/* profile about */}
                                <p className="text-sm">{user.about}</p>

                                {/* hr */}
                                <hr color="#ffffff" />


                                {/* posts-followings-followers */}
                                {/* buttons */}
                                <div className="mt-3 flex justify-center uppercase text-center relative select-none">
                                    <h3 id="posts" onClick={() => someCss("posts")} className="w-1/3 text-blue-100 cursor-pointer">posts</h3>
                                    <h3 id="followings" onClick={() => someCss("followings")} className="w-1/3 text-gray-400 cursor-pointer">followings</h3>
                                    <h3 id="followers" onClick={() => someCss("followers")} className="w-1/3 text-gray-400 cursor-pointer">followers</h3>

                                    <div id="underline" className="absolute left-0 bottom-0 border border-blue-100 w-1/3"></div>
                                </div>
                                {/* slides */}
                                <div className="mt-2 flex overflow-hidden">
                                    <Posts />
                                    <Followings followings={user.followings} />
                                    <Followers followers={user.followers} />
                                </div>
                            </div>
                        </div>
                    }

                </div>
            }
            {
                open && <Dialog />
            }
            {
                userIsRemoved && <Modal
                    message="Your account is deleted you  will be redirected to home page"
                    redirectTo="/"
                    noButton={true}
                />
            }
        </div>
    );

    function Dialog() {
        return (
            <div className="modal-container">
                <div className="modal rounded-lg bg-gray-100 shadow-md">
                    <p>Do you want to delete your account ?</p>
                    <div className="flex mt-3">
                        <button className="rounded-sm px-3 py-1 mr-2 bg-gray-500 text-white cursor-pointer" onClick={closeDialog}>Cancel</button>
                        <button className="rounded-sm px-3 py-1 bg-red-500 text-white cursor-pointer" onClick={removeUser}>Confirm</button>
                    </div>
                </div>
            </div>
        )
    }
}





////////////////////////////////// Followings ////////////////////////////////////

function Followings({ followings }) {

    return (
        <ul className="animation flex flex-wrap justify-center w-full shrink-0">
            {
                followings.length > 0 && followings.map((user, index) =>
                    <Link to={`/users/${user._id}`} key={index}>
                        <li className="flex flex-col justify-center items-center">
                            {/* image */}
                            <div className="flex w-14 h-14">
                                <img alt="following user" className="rounded-full" src={`${config.API_URL}/users/${user._id}/image/?${new Date().getTime()}`} />
                            </div>
                            {/* name */}
                            <span className="w-24 text-center leading-none">{user.name}</span>
                        </li>
                    </Link>
                )
            }
        </ul>
    );
}

////////////////////////////////// Followers /////////////////////////////////////

function Followers({ followers }) {
    return (
        <ul className="animation flex flex-wrap justify-center w-full shrink-0">
            {
                followers.length > 0 && followers.map((user, index) =>
                    <Link to={`/users/${user._id}`} key={index}>
                        <li className="flex flex-col justify-center items-center">
                            {/* image */}
                            <div className="flex w-14 h-14">
                                <img alt="follower user" className="rounded-full" src={`${config.API_URL}/users/${user._id}/image/?${new Date().getTime()}`} />
                            </div>
                            {/* name */}
                            <span className="w-24 text-center leading-none">{user.name}</span>
                        </li>
                    </Link>
                )
            }
        </ul>
    );
}

//////////////////////////////// someCss ////////////////////////////////////

function someCss(name) {

    let first = document.getElementById("first");

    let posts = document.getElementById("posts");
    let followings = document.getElementById("followings");
    let followers = document.getElementById("followers");

    let underline = document.getElementById("underline");

    if (name == "followings") {
        first.style.marginLeft = "-100%";

        followings.style.color = "#242f9b";
        followers.style.color = "#9ca3af"
        posts.style.color = "#9ca3af"

        underline.style.marginLeft = "33.33%";
    }
    if (name == "followers") {
        first.style.marginLeft = "-200%";

        followings.style.color = "#9ca3af";
        followers.style.color = "#242f9b"
        posts.style.color = "#9ca3af"

        underline.style.marginLeft = "66.66%";
    }
    if (name == "posts") {
        first.style.marginLeft = "0";

        followings.style.color = "#9ca3af";
        followers.style.color = "#9ca3af"
        posts.style.color = "#242f9b"

        underline.style.marginLeft = "0";
    }

}