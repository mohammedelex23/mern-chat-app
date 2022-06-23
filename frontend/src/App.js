import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Login from "./auth/Login";
import Signup from "./user/Signup";
import Profile from "./user/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import GeneralError from "./components/GeneralError";
import EditProfile from "./user/EditProfile";
import Navbar from "./components/Navbar";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<ProtectedRoute path="/"></ProtectedRoute>} />
                <Route path="/signup" element={<ProtectedRoute type="spectial" >
                    <Signup />
                </ProtectedRoute>} />
                <Route path="/login" element={<ProtectedRoute type="spectial" >
                    <Login />
                </ProtectedRoute>} />
                <Route path="/users/:userId" element={<ProtectedRoute>
                    <Profile />
                </ProtectedRoute>} />
                <Route path="/users/:userId/edit" element={<ProtectedRoute>
                    <EditProfile />
                </ProtectedRoute>} />
                <Route path="/*" element={
                    <div>
                        <Navbar />
                        <GeneralError error="404 page not found" />
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    )
}