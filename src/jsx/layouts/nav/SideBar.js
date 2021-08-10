/// Menu
import MetisMenu from 'metismenujs';
import React, { Component, useEffect } from 'react';
/// Scroll
import PerfectScrollbar from 'react-perfect-scrollbar';
/// Link
import { Link, useLocation } from 'react-router-dom';

/// Active menu
const manage = ['/employees', '/customers', '/products', '/users', '/types', '/units'];

class MM extends Component {
   componentDidMount() {
      this.$el = this.el;
      this.mm = new MetisMenu(this.$el);
   }

   componentWillUnmount() {
      this.mm.dispose();
   }

   render() {
      return (
         <div className="mm-wrapper">
            <ul className="metismenu" ref={(el) => (this.el = el)}>
               {this.props.children}
            </ul>
         </div>
      );
   }
}

const SideBar = (props) => {
   const { pathname: path } = useLocation();

   useEffect(() => {
      const btn = document.querySelector('.nav-control');
      const aaa = document.querySelector('#main-wrapper');

      function toggleFunc() {
         return aaa.classList.toggle('menu-toggle');
      }

      btn.addEventListener('click', toggleFunc);
   }, []);

   return (
      <div className="deznav">
         <PerfectScrollbar className="deznav-scroll">
            <MM className="metismenu" id="menu">
               <li className={path === '/dashboard' ? 'mm-active' : ''}>
                  <Link className="" to="/dashboard" aria-expanded="false">
                     <i className="flaticon-381-networking" />
                     <span className="nav-text">Dashboard</span>
                  </Link>
               </li>
               <li className={`${manage.includes(path.slice(1)) ? 'mm-active' : ''}`}>
                  <Link className="has-arrow ai-icon color" aria-expanded="false">
                     <i className="flaticon-381-notepad" />
                     <span className="nav-text">Manage</span>
                  </Link>
                  <ul aria-expanded="false">
                     <li>
                        <Link to="/products">Products</Link>
                     </li>
                     <li>
                        <Link to="/suppliers">Suppliers</Link>
                     </li>
                     <li>
                        <Link to="/customers">Customers</Link>
                     </li>
                     <li>
                        <Link to="/app-calender">Users</Link>
                     </li>
                     <li>
                        <Link to="/employees">Employees</Link>
                     </li>
                  </ul>
               </li>
               <li className={path === '/purchase' ? 'mm-active' : ''}>
                  <Link className="" to="/purchase" aria-expanded="false">
                     <i className="flaticon-381-more" />
                     <span className="nav-text">Purchase</span>
                  </Link>
               </li>
               <li className={path === '/sale' ? 'mm-active' : ''}>
                  <Link className="" to="/sale" aria-expanded="false">
                     <i className="flaticon-381-calendar" />
                     <span className="nav-text">Sale</span>
                  </Link>
               </li>
               <li className={path === '/khaata' ? 'mm-active' : ''}>
                  <Link className="" to="/khaata" aria-expanded="false">
                     <i className="flaticon-381-book" />
                     <span className="nav-text">Khaata</span>
                  </Link>
               </li>
               <li className={path === '/expenses' ? 'mm-active' : ''}>
                  <Link className="" to="/expenses" aria-expanded="false">
                     <i className="flaticon-381-briefcase" />
                     <span className="nav-text">Expenses</span>
                  </Link>
               </li>
            </MM>
         </PerfectScrollbar>
      </div>
   );
};

export default SideBar;
