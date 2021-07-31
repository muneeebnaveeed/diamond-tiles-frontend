import React from 'react';
import { Link } from 'react-router-dom';

const pages = ['app', 'ui', 'uc', 'basic', 'form', 'table', 'page', 'email', 'ecom', 'chart', 'editor'];

const Header = ({ onNote, toggle, onProfile, onNotification, onBox }) => {
   const path = window.location.pathname.split('/');
   const name = path[path.length - 1].split('-');
   const filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;

   let finalName = [];

   for (const page of pages) {
      if (filterName.includes(page)) {
         finalName = filterName.filter((f) => f !== page);
         break;
      }
   }

   return (
      <div className="header">
         <div className="header-content">
            <nav className="navbar navbar-expand">
               <div className="collapse navbar-collapse justify-content-between">
                  <div className="header-left">
                     <div className="dashboard_bar" style={{ textTransform: 'capitalize' }}>
                        {finalName.join(' ').length === 0 ? 'Dashboard' : finalName.join(' ')}
                     </div>
                  </div>
                  <ul className="navbar-nav header-right">
                     <li className="nav-item">
                        {/* <div className="input-group search-area d-lg-inline-flex d-none mr-5">
                           <input type="text" className="form-control" placeholder="Search here" />
                           <div className="input-group-append">
                              <span className="input-group-text">
                                 <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       d="M23.7871 22.7761L17.9548 16.9437C19.5193 15.145 20.4665 12.7982 20.4665 10.2333C20.4665 4.58714 15.8741 0 10.2333 0C4.58714 0 0 4.59246 0 10.2333C0 15.8741 4.59246 20.4665 10.2333 20.4665C12.7982 20.4665 15.145 19.5193 16.9437 17.9548L22.7761 23.7871C22.9144 23.9255 23.1007 24 23.2816 24C23.4625 24 23.6488 23.9308 23.7871 23.7871C24.0639 23.5104 24.0639 23.0528 23.7871 22.7761ZM1.43149 10.2333C1.43149 5.38004 5.38004 1.43681 10.2279 1.43681C15.0812 1.43681 19.0244 5.38537 19.0244 10.2333C19.0244 15.0812 15.0812 19.035 10.2279 19.035C5.38004 19.035 1.43149 15.0865 1.43149 10.2333Z"
                                       fill="#A4A4A4"
                                    />
                                 </svg>
                              </span>
                           </div>
                        </div> */}
                     </li>

                     <li className="nav-item dropdown header-profile">
                        <Link to="/page-login" className="dropdown-item ai-icon">
                           <svg
                              id="icon-logout"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-danger"
                              width={18}
                              height={18}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           >
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1={21} y1={12} x2={9} y2={12} />
                           </svg>
                           <span className="ml-2">Logout </span>
                        </Link>
                     </li>
                  </ul>
               </div>
            </nav>
         </div>
      </div>
   );
};

export default Header;
