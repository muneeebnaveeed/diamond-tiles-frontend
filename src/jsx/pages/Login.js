import { post, useAlert } from 'jsx/helpers';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { When } from 'react-if';
import SpinnerOverlay from 'jsx/components/SpinnerOverlay';

const Login = () => {
   const history = useHistory();
   const [loginData, setLoginData] = useState({});
   const [isLoading, setIsLoading] = useState(false);

   const alert = useAlert();

   const handleBlur = (e) => {
      const newLoginData = { ...loginData };
      newLoginData[e.target.name] = e.target.value;
      setLoginData(newLoginData);
   };

   useEffect(() => {
      const token = localStorage.getItem('auth_token');
      if (token) {
         history.push('/dashboard');
      }
   }, []);

   const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const res = await post('/auth/login', loginData);
         setIsLoading(false);
         localStorage.setItem('auth_token', res.token);
         history.push('/dashboard');
      } catch (err) {
         console.log('error', err);
         setIsLoading(false);
         alert.setErrorAlert({ message: 'Unable to login', err });
      }
   };

   return (
      <>
         <When condition={isLoading}>
            <SpinnerOverlay />
         </When>
         <div className="authincation">
            <div className="container p-0">
               <div className="row justify-content-center align-items-center tw-h-screen">
                  <div className="col-lg-6 col-md-9">
                     <div className="authincation-content">
                        <div className="row no-gutters">
                           <div className="col-xl-12">
                              <div className="auth-form">
                                 {alert.getAlert()}
                                 <h4 className="text-center mb-4">Sign in your account</h4>
                                 <form action="" onSubmit={handleLogin}>
                                    <div className="form-group">
                                       <label className="mb-1" htmlFor="login-email">
                                          <strong>Email</strong>
                                       </label>
                                       <input
                                          id="login-email"
                                          type="text"
                                          className="form-control"
                                          name="name"
                                          onChange={handleBlur}
                                       />
                                    </div>
                                    <div className="form-group">
                                       <label className="mb-1" htmlFor="login-password">
                                          <strong>Password</strong>
                                       </label>
                                       <input
                                          id="login-password"
                                          type="password"
                                          className="form-control"
                                          name="password"
                                          onChange={handleBlur}
                                       />
                                    </div>
                                    <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                       <div className="form-group">
                                          <Link to="/page-forgot-password">Forgot Password?</Link>
                                       </div>
                                    </div>
                                    <div className="text-center">
                                       <button type="submit" className="btn btn-primary btn-block">
                                          Sign Me In
                                       </button>
                                    </div>
                                 </form>
                                 <div className="new-account mt-3">
                                    <p>
                                       Don't have an account?{' '}
                                       <Link className="text-primary" to="/page-register">
                                          Sign up
                                       </Link>
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Login;
