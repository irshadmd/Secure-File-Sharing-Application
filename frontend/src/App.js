import React, { useEffect, useState } from 'react';
import api from './api/api';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/hello/')
            .then(response => setMessage(response.data.message))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="App">
            <h1>{message}</h1>
        </div>
    );
}

export default App;
