import React, { useEffect, useState } from "react";
import authApi from "./auth-api";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { hideNav } from "../helpers";
import Navbar from "../components/Navbar";
import authHelper from "./auth-helper";
import AuthError from "../components/AuthError";
import GeneralError from "../components/GeneralError";


export default function Login() {

    let navigate = useNavigate();
    const { state } = useLocation();


    const [values, setValues] = useState({
        email: "",
        password: "",
        isRedirect: false
    });

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [authError, setAuthError] = useState('');


    useEffect(() => {
        if (values.isRedirect) {
            navigate(state || '/')
        }
    }, [values.isRedirect])

    const handleChange = name => e => {
        setValues({ ...values, [name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setEmailError("");
            setPasswordError("");
            setAuthError("")
            const user = {
                email: values.email,
                password: values.password
            }

            let res = await authApi.login(user);
            authHelper.authenticate(res, function () {
                setValues({ ...values, isRedirect: true });
            })

        } catch (error) {
            console.log("login",error);
            if (error.errors.type === "authError") {
                setAuthError(error.errors.errors[0].message);
            } else {
                error.errors.errors.forEach(error => {
                    switch (error.name) {
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

    return (
        <div>
            <Navbar />
            <div className="p-6 max-w-sm mt-2 bg-white rounded-xl mx-auto shadow-md space-x-4">
                <h1 className="text-blue-100 font-bold text-xl mb-5">Login</h1>
                {authError && <GeneralError error={authError} />}
                <form className="custom-form" method="POST" onSubmit={handleSubmit}>
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
                        <button onClick={hideNav} className="btn-primary" type="submit">Login</button>
                        <p className="mt-1 text-lg text-gray-600">or</p>
                        <Link className="text-lg font-medium text-blue-101 underline" to="/signup">sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}