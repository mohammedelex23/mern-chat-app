import React, { useEffect, useState } from "react";
import config from "../config";
import { BiCamera } from 'react-icons/bi'
import authHelper from "../auth/auth-helper";
import postApi from "./post-api";
import Compressor from 'compressorjs';
import { Link } from "react-router-dom";

export default function CreatePost({ addPost }) {

    const localInfo = authHelper.getLocalUser();
    const token = localInfo && localInfo.token;
    const userId = localInfo && localInfo.user._id;

    const imageUrl = `${config.API_URL}/users/${userId}/image/?${new Date().getTime()}`

    const [values, setValues] = useState({
        text: '',
        photo: '',
        filename: ''
    })
    const [btnLoading, setBtnLoading] = useState(false)




    const handleChange = (name) => (e) => {
        let value = name == "photo" ? e.target.files[0] : e.target.value;
        let filename = name == "photo" ? e.target.files[0] && e.target.files[0].name : '';
        e.target.value = '';
        setValues({ ...values, [name]: value, filename })
    }

    const createPost = async (e) => {
        e.preventDefault();

        if (values.photo) {

            setBtnLoading(true)
            new Compressor(values.photo, {
                quality: 0.6,

                // create post after success
                async success(photo) {
                    try {
                        let formData = new FormData();
                        formData.append("text", values.text);
                        formData.append("photo", photo)

                        setValues({ ...values, text: '', photo: '', filename: '' })


                        let res = await postApi.createPost(formData, userId, token);

                        setBtnLoading(false)
                        addPost(res.post)
                    } catch (error) {
                        console.log(error);
                        setBtnLoading(false)
                        setValues({ ...values, text: '', photo: '', filename: '' })
                    }
                },
                error(err) {
                    console.log(err);
                    setBtnLoading(false)
                    setValues({ ...values, text: '', photo: '', filename: '' })
                },
            });
        } else {
            try {
                let formData = new FormData();
                formData.append("text", values.text);

                setValues({ ...values, text: '', photo: '', filename: '' })


                let res = await postApi.createPost(formData, userId, token);

                setBtnLoading(false)
                addPost(res.post)
            } catch (error) {

                setBtnLoading(false)
                setValues({ ...values, text: '', photo: '', filename: '' })
            }
        }

    }

    return (
        <div className="select-none">
            {/* image and name */}
            <div className="flex p-2 bg-blue-102 items-center">
                {/* image */}
                <Link to={`/users/${userId}`} className="flex w-14 mr-2 h-14"><img className="rounded-full" crossOrigin="anonymous" src={imageUrl} /></Link>
                <span className="text-white text-lg">{localInfo.user.name}</span>
            </div>

            {/* post input field*/}
            <form onSubmit={createPost} className="py-2">
                <p className="text-gray-400">Share your thoughts</p>
                {/* text input field */}
                <input value={values.text} required onChange={handleChange("text")}
                    style={{
                        border: "none",
                        borderBottom: "2px solid gray",
                        outline: "none"
                    }} className="border-none mb-2 px-2 w-full" />
                {/* hidden file input */}
                <input accept="image/*" onChange={handleChange("photo")} id="photo" type="file" className="hidden" />
                <label className="flex items-center" htmlFor="photo">
                    <BiCamera className="text-3xl mr-1 cursor-pointer text-orange-500" />
                    <span>{values.filename}</span>
                </label>
                {/* post button */}
                <div className="bg-blue-102 mt-2 p-2">
                    {
                        btnLoading && <button type="submit" id="btn" className="btn-primary rounded-none bg-blue-102 p-0 px-4 py-1">Posting...</button>
                    }
                    {
                        !btnLoading && <button type="submit" id="btn" className="btn-primary rounded-none bg-blue-100 p-0 px-4 py-1">Post</button>
                    }
                </div>
            </form>

        </div>
    )
}