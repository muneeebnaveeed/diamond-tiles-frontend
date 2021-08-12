import React from 'react';
/// Image
import Avatar from 'react-avatar';
import { Link, useHistory } from 'react-router-dom';

const pages = ['products', 'suppliers', 'customers', 'users', 'employees', 'purchase', 'sale', 'khaata', 'expenses'];

const Header = ({ onNote, toggle, onProfile, onNotification, onBox }) => {
   const history = useHistory();
   const path = window.location.pathname.split('/');
   const name = path[path.length - 1].split('-');
   const filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;

   let finalName = '';

   for (const page of pages) {
      if (filterName.includes(page)) {
         finalName = filterName.find((f) => f === page);
         break;
      }
   }

   const handleLogout = () => localStorage.clear();

   React.useEffect(() => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
         history.push('/page-login');
      }
   }, []);

   return (
      <div className="header">
         <div className="header-content">
            <nav className="navbar navbar-expand">
               <div className="collapse navbar-collapse justify-content-between">
                  <div className="header-left">
                     <div className="dashboard_bar" style={{ textTransform: 'capitalize' }}>
                        {finalName || 'Dashboard'}
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
                           <Link to="/" className="dropdown-item ai-icon" onClick={handleLogout}>
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
