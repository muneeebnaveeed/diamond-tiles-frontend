import React, { memo } from 'react';
import Nav from './nav';
import Footer from './Footer';

const Layout = ({ children: Children, isPublic }) => {
   const MemoizedNav = memo(Nav);
   if (isPublic)
      return (
         <>
            <div id="main-wrapper" className="show">
               <div className="container-fluid">
                  {/* <Children /> */}
                  {Children}
               </div>
            </div>
         </>
      );

   return (
      <>
         <div id="main-wrapper" className="show">
            <MemoizedNav />
            <div className="content-body">
               <div className="container-fluid">
                  {/* <Children /> */}
                  {Children}
               </div>
            </div>
            <Footer />
         </div>
      </>
   );
};
export default Layout;
