import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import FileList from '../FileList';

const MainRoutes = () => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (<>
      <div>Welcome, {user.name}!</div>
      <FileList />
      <Routes>
        <Route path='test' element={<>testing</>}/>
        <Route path='test/asg' element={<>/test/asg</>}/>
      </Routes>
    </>);
};

export default MainRoutes;