import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthError from "../components/AuthError";
import GeneralError from "../components/GeneralError";
import Navbar from "../components/Navbar";
import { hideNav } from "../helpers";
import userApi from "./user-api";
import { MdFileUpload } from 'react-icons/md';
import config from "../config";
import Compressor from 'compressorjs';

export default function EditProfile() {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        image: '',
        about: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // errors
    const [getProfileError, setGetProfileError] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');


    const { token, user: localInfo } = JSON.parse(localStorage.getItem('user'));
    let { userId } = useParams();
    let navigate = useNavigate();

    const imageUrl = localInfo._id
        ? `${config.API_URL}/users/${localInfo._id}/image/?${new Date().getTime()}`
        : `${config.API_URL}/users/defaultimage`

    useEffect(() => {

        let abortController = new AbortController()
        let signal = abortController.signal;

        getProfile(token, userId, signal);


        return () => {
            abortController.abort();
        }
    }, [userId, token])

    async function getProfile(token, userId, signal) {
        try {
            setIsLoading(true);
            setGetProfileError('');
            let res = await userApi.read(token, userId, signal);
            setValues({
                ...values,
                name: res.user.name,
                email: res.user.email,
                about: res.user.about
            });
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            // setValues();
            setIsLoading(false);
            setGetProfileError(error);
        }
    }








    const handleChange = name => e => {
        const value =
            (name === "image") ? e.target.files[0] : e.target.value;
        setValues({ ...values, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (values.image) {
            new Compressor(values.image, {
                quality: 0.6,


                async success(image) {
                    try {
                        setNameError("");
                        setEmailError("");
                        setPasswordError("");
                        setGetProfileError("")

                        const userData = new FormData();
                        values.name && userData.append('name', values.name);
                        values.email && userData.append('email', values.email);
                        values.password && userData.append('password', values.password);
                        values.image && userData.append('image', image);
                        values.about && userData.append('about', values.about);


                        let res = await userApi.update(userData, userId, token);
                        console.log(res);
                        if (res) {
                            return navigate(`/users/${userId}`);
                        }
                    } catch (error) {
                        if (error.type === "imageUpload") {
                            setGetProfileError(error.message);
                        } else {
                            error.errors.forEach(error => {
                                switch (error.name) {
                                    case "name":
                                        setNameError(error.message);
                                        break;
                                    case "email":
                                        setEmailError(error.message);
                                        break;
                                    case "password":
                                        setPasswordError(error.message);
                                        break;
                                    default:
                                        break;
                                }
                            });
                        }
                    }
                },
                error(err) {
                    setGetProfileError('try again')
                },
            });
        } else {
            try {
                setNameError("");
                setEmailError("");
                setPasswordError("");
                setGetProfileError("")

                const userData = new FormData();
                values.name && userData.append('name', values.name);
                values.email && userData.append('email', values.email);
                values.password && userData.append('password', values.password);
                // values.image && userData.append('image', values.image);
                values.about && userData.append('about', values.about);


                let res = await userApi.update(userData, userId, token);
                console.log(res);
                if (res) {
                    return navigate(`/users/${userId}`);
                }
            } catch (error) {
                if (error.type === "imageUpload") {
                    setGetProfileError(error.message);
                } else {
                    error.errors.forEach(error => {
                        switch (error.name) {
                            case "name":
                                setNameError(error.message);
                                break;
                            case "email":
                                setEmailError(error.message);
                                break;
                            case "password":
                                setPasswordError(error.message);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        }
    }

    return (
        <div>
            <Navbar page="edit-profile" />
            {
                getProfileError && <GeneralError error={getProfileError} />
            }
            {
                isLoading && <div className="text-center mt-4">Loading...</div>
            }
            {
                values && <div>
                    <div className="p-4 max-w-sm mt-2 bg-white rounded-xl mx-auto shadow-md space-x-4">
                        {/* profile image and upload button */}
                        <div className="flex flex-col items-center justify-center">
                            {/* image div */}
                            <div className="w-56 h-56">
                                <img alt="user" className="w-full h-full rounded-full" src={imageUrl} />
                            </div>
                            {/* upload button */}
                            <div className="mt-3 flex justify-center items-center">
                                {/* hidden upload input */}
                                <input onChange={handleChange("image")} accept="image/*" name="image" className="hidden" id="file-upload" type="file" />
                                {/* file upload button */}
                                <label className="px-3 py-1 rounded-sm bg-gray-300 flex justify-center items-center" htmlFor="file-upload">
                                    <span className="cursor-pointer">UPLOAD</span>
                                    <MdFileUpload className="text-lg" />
                                </label>
                                {/* file name */}
                                {
                                    <span className="ml-2 w-16 text-center overflow-hidden text-ellipsis">{values.image.name ? values.image.name : ''}</span>
                                }
                            </div>
                        </div>
                        {/* form */}
                        <form className="custom-form" method="POST" onSubmit={handleSubmit}>
                            {/* name */}
                            <div className="mb-2 flex flex-col">
                                <label htmlFor="name">Name</label>
                                <input className="input-primary" placeholder="Name" value={values.name} onChange={handleChange("name")} type="text" name="name" />
                                {nameError && <AuthError error={nameError} />}
                            </div>
                            {/* about */}
                            <div className="mb-2 flex flex-col">
                                <label htmlFor="about">About</label>
                                <textarea id="about" name="about" value={values.about} className="input-primary resize-none" rows="2" onChange={handleChange("about")} />
                            </div>
                            {/* email */}
                            <div className="mb-2 flex flex-col">
                                <label htmlFor="email">Email</label>
                                <input className="input-primary" placeholder="Email" value={values.email} onChange={handleChange("email")} type="text" name="email" />
                            </div>
                            {emailError && <AuthError error={emailError} />}
                            {/* password */}
                            <div className="flex flex-col">
                                <label htmlFor="password">Password</label>
                                <input className="input-primary" placeholder="Password" value={values.password} onChange={handleChange("password")} type="password" name="password" />
                            </div>
                            {passwordError && <AuthError error={passwordError} />}
                            {/* submit button */}
                            <div className="flex justify-center items-center flex-col mt-2">
                                <button onClick={hideNav} className="btn-primary bg-blue-500 mb-2" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}
