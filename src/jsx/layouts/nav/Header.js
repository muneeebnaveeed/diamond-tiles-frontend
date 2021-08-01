import React from 'react';

import { Link } from 'react-router-dom';
/// Scroll
import PerfectScrollbar from 'react-perfect-scrollbar';

/// Image
import Avatar from 'react-avatar';
import profile from '../../../images/profile/17.jpg';
import avatar from '../../../images/avatar/1.jpg';

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
                     <li className="nav-item dropdown header-profile">
                        <Link
                           to="#"
                           role="button"
                           data-toggle="dropdown"
                           className={`nav-item dropdown header-profile ${toggle === 'profile' ? 'show' : ''}`}
                           onClick={() => onProfile()}
                        >
                           {/* <img alt="Profile" src={profile} width={20} /> */}
                           <Avatar name="Foo Bar" size="38" textSizeRatio={2.9} round />
                        </Link>
                        <div className={`dropdown-menu dropdown-menu-right ${toggle === 'profile' ? 'show' : ''}`}>
                           <Link to="/app-profile" className="dropdown-item ai-icon">
                              <svg
                                 id="icon-user1"
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="text-primary"
                                 width={18}
                                 height={18}
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor"
                                 strokeWidth={2}
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              >
                                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                 <circle cx={12} cy={7} r={4} />
                              </svg>
                              <span className="ml-2">Profile </span>
                           </Link>
                           <Link to="/email-inbox" className="dropdown-item ai-icon">
                              <svg
                                 id="icon-inbox"
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="text-success"
                                 width={18}
                                 height={18}
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor"
                                 strokeWidth={2}
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              >
                                 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                 <polyline points="22,6 12,13 2,6" />
                              </svg>
                              <span className="ml-2">Inbox </span>
                           </Link>
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
                        </div>
                     </li>
                  </ul>
               </div>
            </nav>
         </div>
      </div>
   );
};

export default Header;
