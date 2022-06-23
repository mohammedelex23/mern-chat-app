import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthError from "../components/AuthError";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import { hideNav } from "../helpers";
import userApi from "./user-api";

export default function Signup() {

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        signedUp: false
    });

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');


    useEffect(() => {

    }, [nameError, emailError, passwordError])




    const handleChange = name => e => {
        setValues({ ...values, [name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setNameError("");
            setEmailError("");
            setPasswordError("");

            const user = {
                name: values.name || undefined,
                email: values.email || undefined,
                password: values.password || undefined
            }

            let created = await userApi.create(user);
            if (created === true) {
                setValues({ ...values, signedUp: true });
            }
        } catch (error) {
            error.errors.errors.forEach(error => {
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

    return (
        <div>
            <Navbar />
            <div className="p-4 max-w-sm mt-2 bg-white rounded-xl mx-auto shadow-md space-x-4">
                <h1 className="pt-2 text-blue-100 font-bold text-xl mb-5">Signup</h1>
                <form className="custom-form" method="POST" onSubmit={handleSubmit}>
                    <div className="mb-2 flex flex-col">
                        <label htmlFor="name">Name</label>
                        <input className="input-primary" placeholder="Name" value={values.name} onChange={handleChange("name")} type="text" name="name" />
                        {nameError && <AuthError error={nameError} />}
                    </div>
                    <div className="mb-2 flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input className="input-primary" placeholder="Email" value={values.email} onChange={handleChange("email")} type="text" name="email" />
                    </div>
                    {emailError && <AuthError error={emailError} />}
                    <div className="mb-3 flex flex-col">
                        <label htmlFor="password">Password</label>
                        <input className="input-primary" placeholder="Password" value={values.password} onChange={handleChange("password")} type="password" name="password" />
                    </div>
                    {passwordError && <AuthError error={passwordError} />}
                    <div className="flex justify-center items-center flex-col mt-2">
                        <button onClick={hideNav} className="btn-primary mb-2" type="submit">Signup</button>
                        <p className="mt-1 text-lg text-gray-600">or</p>
                        <Link className="text-lg font-medium text-blue-101 underline" to="/login">log in</Link>
                    </div>
                </form>
                {values.signedUp && <Modal
                    message="You have successfully signed up clik ok to go to login page"
                    redirectTo="/login"
                />}
            </div>
        </div>
    );
}

