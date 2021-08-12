import React, { memo, useEffect } from 'react';
import { setLogin } from 'store/auth/actions';
import { connect } from 'react-redux';
import Nav from './nav';
import Footer from './Footer';
import { get } from '../helpers';

const token = localStorage.getItem('auth_token');

const Layout = ({ children: Children, isPublic, setUser }) => {
   const getUserProfile = async () => {
      try {
         const res = await get(`/auth/decode/${token}`);
         setUser(res);
      } catch (error) {
         setUser({});
      }
   };

   useEffect(() => {
      if (token) {
         getUserProfile();
      }
   }, [token]);

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
const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
   setUser: (payload) => dispatch(setLogin(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
