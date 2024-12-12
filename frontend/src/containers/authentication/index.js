import React from 'react';
import { useSelector } from 'react-redux';

const Authentication = () => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <div>Loading...</div>;
    }

    return <div>Welcome, {user.name}!</div>;
};

export default Authentication;