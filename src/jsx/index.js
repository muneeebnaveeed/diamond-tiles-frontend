import React, { Suspense } from 'react';

/// React router dom
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

/// Css
import './index.css';
import './chart.css';

/// Pages
import Registration from './pages/Registration';
import Login from './pages/Login';
import Error404 from './pages/Error404';
import Layout from './layouts';
import Employees from './pages/employees';
import Customers from './pages/customers';
import Suppliers from './pages/suppliers';
import Products from './pages/products';
import CustomerActions from './pages/customers/CustomerActions';
import SupplierActions from './pages/suppliers/SupplierActions';
import EmployeeActions from './pages/employees/EmployeeActions';
import ProductActions from './pages/products/ProductActions';
// import Types from './pages/types';
// import Units from './pages/units';
import Purchase from './pages/purchase';
import Sales from './pages/sale';
import Expenses from './pages/expenses';
import ExpensesActions from './pages/expenses/ExpenseActions';
import TypeActions from './pages/types/TypeActions';
import Dashboard from './pages/dashboard';
import Khaata from './pages/khaata';
import AddPurchase from './pages/purchase/AddPurchase';
import AddSale from './pages/sale/AddSale';

const routes = [
   /// Deshborad
   { url: '', component: () => <Redirect to="/page-login" /> },
   { url: 'dashboard', component: Dashboard },

   { url: 'page-register', component: Registration, isPublic: true },
   { url: 'page-login', component: Login, isPublic: true },

   { url: 'employees', component: Employees },
   { url: 'employees/:id', component: EmployeeActions },
   { url: 'customers', component: Customers },
   { url: 'customers/:id', component: CustomerActions },
   { url: 'suppliers', component: Suppliers },
   { url: 'suppliers/:id', component: SupplierActions },
   { url: 'products', component: Products },
   { url: 'products/:id', component: ProductActions },
   { url: 'products/types/:id', component: TypeActions },
   // { url: 'types', component: Types },
   // { url: 'units', component: Units },
   { url: 'purchase', component: Purchase },
   { url: 'purchase/add', component: AddPurchase },
   { url: 'sale', component: Sales },
   { url: 'sale/add', component: AddSale },
   { url: 'expenses', component: Expenses },
   { url: 'expenses/:id', component: ExpensesActions },
   { url: 'khaata', component: Khaata },
];

const Markup = () => (
   <Suspense fallback={<p>Loading</p>}>
      <Router>
         {/* <div id="main-wrapper" className="show">
         <Nav /> */}

         {/* <div className="content-body">
            <div className="container-fluid"> */}
         <Switch>
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
            <Route component={Error404} />
         </Switch>
         {/* </div>
         </div>

         <Footer />
      </div> */}
      </Router>
   </Suspense>
);

export default Markup;
