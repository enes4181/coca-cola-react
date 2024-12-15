import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, roles = [], userRole, children }) => {
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" />;
    }

    if (roles.length > 0 && !roles.includes(userRole)) {
        // Kullanıcının rolü uygun değilse yetkisiz sayfasına yönlendir
        return <Navigate to="/unauthorized" />;
    }

    return children;
};


export default ProtectedRoute;
