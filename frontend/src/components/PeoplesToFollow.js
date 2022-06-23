import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../config";
import authHelper from "../auth/auth-helper";
import userApi from "../user/user-api";
import GeneralError from "./GeneralError";
export default function PeoplesToFollow() {

    let localUser = authHelper.getLocalUser();
    let userId = localUser && localUser.user._id;
    let token = localUser && localUser.token;

    const [values, setValues] = useState({
        peoplesToFollowLoading: false,
        peoplesToFollowError: '',
        peoplesToFollow: ''
    })



    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        getPeoplesToFollow(signal);


        // cleanup function
        return () => {
            abortController.abort();
        }
    }, []);


    async function getPeoplesToFollow(signal) {
        try {
            setValues({ ...values, peoplesToFollowLoading: true, peoplesToFollowError: '' });
            let peoplesToFollow = await userApi.peoplesToFollow(userId, signal);

            setValues({ ...values, peoplesToFollowLoading: false, peoplesToFollowError: '', peoplesToFollow });
        } catch (error) {
            setValues({ ...values, peoplesToFollowLoading: false, peoplesToFollowError: error.message, peoplesToFollow: '' });
        }
    }

    function imageUrl(id) {
        return `${config.API_URL}/users/${id}/image/?${new Date().getTime()}`
    }

    const handleClick = (followingId) => async () => {
        try {
            setValues({ ...values, peoplesToFollowError: '' });

            let obj = {
                userId: userId || undefined,
                followingId: followingId || undefined
            }

            await userApi.follow(obj, token);
            let updatedList = [...values.peoplesToFollow];
            updatedList = updatedList.filter(obj => obj._id != followingId);
            setValues({ ...values, peoplesToFollow: updatedList });
        } catch (error) {
            setValues({ ...values, isFollowed: false, peoplesToFollowError: error.message })
        }
    }

    return (
        <div className="slide">
            {
                values.peoplesToFollowError && <GeneralError error={values.peoplesToFollowError} />
            }
            {
                values.peoplesToFollowLoading && <div>Loading...</div>
            }
            {
                values.peoplesToFollow && <div>
                    <ul>
                        {
                            values.peoplesToFollow && values.peoplesToFollow.length == 0 &&
                            <div className="text-center text-red-500">
                                no user to follow
                            </div>
                        }
                        {
                            values.peoplesToFollow.map((user, index) => <li key={index} className="flex mb-2 justify-between items-center">
                                {/* image */}
                                <Link to={`/users/${user._id}`}>
                                    <div className="flex w-14 h-14"><img className="w-full rounded-full" src={imageUrl(user._id)} /></div>
                                </Link>
                                {/* name */}
                                <h3 className="-ml-8 font-bold">{user.name}</h3>
                                {/* follow button */}
                                <button onClick={handleClick(user._id)} className="bg-blue-100 uppercase text-white px-4 py-1 text-sm">
                                    Follow
                                </button>
                            </li>

                            )
                        }
                    </ul>
                </div>
            }
        </div>
    );
}