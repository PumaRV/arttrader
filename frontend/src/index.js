import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render( 
        <div>
            <Header />
        </div>,
         document.getElementById('root')
    );

registerServiceWorker();