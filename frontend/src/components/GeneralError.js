import React from "react";
import AuthError from "./AuthError";


export default function GeneralError({error}) {
    return (
        <div className="mx-auto mt-5 capitalize flex justify-center">
            <AuthError error={error} />
        </div>
    )
}