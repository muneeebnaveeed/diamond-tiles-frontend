import { post } from 'jsx/helpers';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const Register = () => {
   const history = useHistory();

   const [registrationData, setRegistrationData] = useState({});
   const handleBlur = (e) => {
      const newRegistrationData = { ...registrationData };
      newRegistrationData[e.target.name] = e.target.value;
      setRegistrationData(newRegistrationData);
   };
   const handleRegister = async (e) => {
      e.preventDefault();
      try {
         const res = await post('/auth/register', registrationData);
         localStorage.setItem('auth_token', res.token);
         history.push('/dashboard');
      } catch (err) {
         alert(err.response?.data?.data ?? err.message);
      }
   };
   return (
      <div className="authincation">
         <div className="container p-0">
            <div className="row justify-content-center align-items-center tw-h-screen">
               <div className="col-lg-6 col-md-9">
                  <div className="authincation-content">
                     <div className="row no-gutters">
                        <div className="col-xl-12">
                           <div className="auth-form">
                              <h4 className="text-center mb-4">Sign up your account</h4>
                              <form action="" onSubmit={handleRegister}>
                                 <div className="form-group">
                                    <label className="mb-1" htmlFor="registration-username">
                                       <strong>Username</strong>
                                    </label>
                                    <input
                                       id="registration-username"
                                       type="text"
                                       className="form-control"
                                       name="name"
                                       onChange={handleBlur}
                                    />
                                 </div>
                                 {/* <div className="form-group">
                                    <label className="mb-1" htmlFor="registration-email">
                                       <strong>Email</strong>
                                    </label>
                                    <input
                                       id="registration-email"
                                       type="email"
                                       className="form-control"
                                       placeholder="hello@example.com"
                                       name="Email"
                                       onChange={handleBlur}
                                    />
                                 </div> */}
                                 <div className="form-group">
                                    <label className="mb-1" htmlFor="registration-password">
                                       <strong>Password</strong>
                                    </label>
                                    <input
                                       id="registration-password"
                                       type="password"
                                       className="form-control"
                                       name="password"
                                       onChange={handleBlur}
                                    />
                                 </div>
                                 <div className="form-group">
                                    <label className="mb-1" htmlFor="registration-password">
                                       <strong>Password</strong>
                                    </label>
                                    <input
                                       id="registration-password"
                                       type="password"
                                       className="form-control"
                                       name="passwordConfirm"
                                       onChange={handleBlur}
                                    />
                                 </div>
                                 <div className="text-center mt-4">
                                    <button type="submit" className="btn btn-primary btn-block">
                                       Sign me up
                                    </button>
                                 </div>
                              </form>
                              <div className="new-account mt-3">
                                 <p>
                                    Already have an account?{' '}
                                    <Link className="text-primary" to="/page-login">
                                       Sign in
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
   );
};

export default Register;
