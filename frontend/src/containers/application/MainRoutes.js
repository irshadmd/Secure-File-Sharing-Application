import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import FileList from '../FileList';
import SecureAppBar from '../../components/SecureAppBar';

const MainRoutes = () => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (<>
      <SecureAppBar />
      <Routes>
        <Route index element={<FileList />}/>
        <Route path='shared' element={<>testing</>}/>
        <Route path='quickshare' element={<>/test/asg</>}/>
      </Routes>
    </>);
};

export default MainRoutes;