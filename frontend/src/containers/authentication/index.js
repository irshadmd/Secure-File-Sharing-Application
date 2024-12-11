
import React from 'react';

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Authentication = () => {
  const token = localStorage.getItem("token")
  const user = useSelector((state) => state.auth.user)

  console.log(user)
    return(
      <>
        {!token?
          <Navigate to='/login' />
          :<>testing</>
        }
      </>
  )
}

export default Authentication

