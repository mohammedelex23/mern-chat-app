import React from "react";
export default function AuthError({error}) {
    return (
        <div className="text-red-600">{error}</div>
    );
}