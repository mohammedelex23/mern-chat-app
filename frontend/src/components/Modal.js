import React from "react"
import { Link } from "react-router-dom"

export default function Modal({ message, redirectTo, noButton }) {
    return (
        <div className="modal-container">
            <div className="modal rounded-lg bg-gray-100 shadow-md">
                <p className="text-green-600">{message}</p>
                {
                    !noButton && <Link to={redirectTo} className="mt-2 btn-success">OK</Link>
                }
            </div>
        </div>
    )
}