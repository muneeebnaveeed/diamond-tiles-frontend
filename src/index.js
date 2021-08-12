import React from 'react';
import ReactDOM from 'react-dom';
import SimpleReactLightbox from 'simple-react-lightbox';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

ReactDOM.render(
   <Provider store={store}>
      <SimpleReactLightbox>
         <App />
      </SimpleReactLightbox>
   </Provider>,
   document.getElementById('root')
);
