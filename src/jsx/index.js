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
import AddNewCustomer from './pages/customers/AddNewCustomer';
import CustomerActions from './pages/customers/CustomerActions';
import Dashboard from './pages/dashboard';
import Employees from './pages/employees';
import AddNewEmployee from './pages/employees/AddNewEmployee';
import EmployeeActions from './pages/employees/EmployeeActions';
import Error404 from './pages/Error404';
import Expenses from './pages/expenses';
import AddNewExpense from './pages/expenses/AddNewExpense';
import ExpensesActions from './pages/expenses/ExpenseActions';
import Inventory from './pages/inventory';
import AddNewInventory from './pages/inventory/AddNewInventory';
import Khaata from './pages/khaata';
import Login from './pages/Login';
import Products from './pages/products';
import AddNewProduct from './pages/products/AddNewProduct';
import ProductActions from './pages/products/ProductActions';
import Purchase from './pages/purchase';
import AddPurchase from './pages/purchase/AddPurchase';
/// Pages
import Registration from './pages/Registration';
import AddNewSalary from './pages/salaries/AddNewSalary';
import Sales from './pages/sale';
import AddSale from './pages/sale/AddSale';
import Suppliers from './pages/suppliers';
import AddNewSupplier from './pages/suppliers/AddNewSupplier';
import SupplierActions from './pages/suppliers/SupplierActions';
import AddNewType from './pages/types/AddNewType';
import TypeActions from './pages/types/TypeActions';
import AddNewUnit from './pages/units/AddNewUnit';
import users from './pages/users';

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
   { url: 'users', component: users },
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
   { url: 'inventory', component: Inventory },
   { url: 'dashboard', component: Dashboard },
];

const Markup = (props) => (
   <Suspense fallback={<p>Loading</p>}>
      <AddNewProduct />
      <AddNewType />
      <AddNewUnit />
      <AddNewSupplier />
      <AddNewCustomer />
      <AddNewSalary />
      <AddNewEmployee />
      <AddNewInventory />
      <AddNewExpense />

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
