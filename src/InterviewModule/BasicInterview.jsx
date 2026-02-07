import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const BasicInterview = () => {
    const location = useLocation();

    return (
        <Navigate
            to="/interview/session"
            replace
            state={location.state}
        />
    );
};

export default BasicInterview;
