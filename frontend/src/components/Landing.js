import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";


export default function Landing() {
    return (
        <div className="bg-green">
            <Navbar />
            <div className="home-box">
                <div className="overlay">
                    <div className="w-4/5 mx-auto z-10 mt-24 text-white">
                    <h2 className="text-2xl mb-3">Find new friends and connect with them</h2>
                    <Link className="btn-primary" to="/signup">Create account</Link>
                    <span className="mx-2">or</span>
                    <Link className="text-pink-500 text-lg underline" to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}