import React from 'react';
import { withResizeDetector } from 'react-resize-detector';

/// Components
import Markup from './jsx';

/// Style
import './vendor/bootstrap-select/dist/css/bootstrap-select.min.css';
import './css/style.css';

const App = ({ width }) => {
   const body = document.querySelector('body');

   if (width >= 1300) body.setAttribute('data-sidebar-style', 'full');
   else if (width <= 1299 && width >= 767) body.setAttribute('data-sidebar-style', 'mini');
   else body.setAttribute('data-sidebar-style', 'overlay');

   return (
      <>
         <Markup />
      </>
   );
};

export default withResizeDetector(App);
