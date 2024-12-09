import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import Application from './containers/application';

const App = () => {
    return(
        <Provider store={store}>
            <BrowserRouter>
                <Application />
            </BrowserRouter>
        </Provider>
    )
};

export default App;
