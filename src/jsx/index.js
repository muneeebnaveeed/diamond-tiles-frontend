import React, { Suspense } from 'react';
import { Else, If, Then } from 'react-if';
import { connect } from 'react-redux';
/// React router dom
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './chart.css';
import { userRoles } from './helpers/enums';
/// Css
import './index.css';
import Layout from './layouts';
import Customers from './pages/customers';
import CustomerActions from './pages/customers/CustomerActions';
import Dashboard from './pages/dashboard';
import Employees from './pages/employees';
import EmployeeActions from './pages/employees/EmployeeActions';
import Error404 from './pages/Error404';
import Expenses from './pages/expenses';
import ExpensesActions from './pages/expenses/ExpenseActions';
import Inventory from './pages/inventory';
import Khaata from './pages/khaata';
import Login from './pages/Login';
import Products from './pages/products';
import ProductActions from './pages/products/ProductActions';
import Purchase from './pages/purchase';
import AddPurchase from './pages/purchase/AddPurchase';
/// Pages
import Registration from './pages/Registration';
import Sales from './pages/sale';
import AddSale from './pages/sale/AddSale';
import Suppliers from './pages/suppliers';
import SupplierActions from './pages/suppliers/SupplierActions';
import TypeActions from './pages/types/TypeActions';

const protectedRoutes = [
   { url: 'employees', component: Employees },
   // { url: 'dashboard', component: Dashboard },
   { url: 'employees/:id', component: EmployeeActions },
];

const routes = [
   /// Deshborad
   { url: '', component: () => <Redirect to="/page-login" /> },
   { url: 'page-register', component: Registration, isPublic: true },
   { url: 'page-login', component: Login, isPublic: true },

   { url: 'customers', component: Customers },
   { url: 'customers/:id', component: CustomerActions },
   { url: 'suppliers', component: Suppliers },
   { url: 'suppliers/:id', component: SupplierActions },
   { url: 'products', component: Products },
   { url: 'products/:id', component: ProductActions },
   { url: 'products/types/:id', component: TypeActions },
   { url: 'purchase', component: Purchase },
   { url: 'purchase/add', component: AddPurchase },
   { url: 'sale', component: Sales },
   { url: 'sale/add', component: AddSale },
   { url: 'expenses', component: Expenses },
   { url: 'expenses/:id', component: ExpensesActions },
   { url: 'khaata', component: Khaata },
   { url: 'inventory', component: Inventory },
];

const Markup = (props) => (
   <Suspense fallback={<p>Loading</p>}>
      <Router>
         <Switch>
            <If condition={props.user?.role === userRoles.CASHIER}>
               <Then>
                  {routes.map((data, i) => {
                     const getComponent = () => {};
                     return (
                        <Route key={i} exact path={`/${data.url}`}>
                           <Layout isPublic={data.isPublic}>
                              <data.component />
                           </Layout>
                        </Route>
                     );
                  })}
               </Then>
               <Else>
                  {[...routes, ...protectedRoutes].map((data, i) => {
                     const getComponent = () => {};
                     return (
                        <Route key={i} exact path={`/${data.url}`}>
                           <Layout isPublic={data.isPublic}>
                              <data.component />
                           </Layout>
                        </Route>
                     );
                  })}
               </Else>
            </If>

            <Route component={Error404} />
         </Switch>
      </Router>
   </Suspense>
);

const mapStateToProps = ({ auth }) => ({
   user: auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Markup);
