import React, { Suspense } from 'react';

/// React router dom
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { If, Then, Else } from 'react-if';

/// Css
import './index.css';
import './chart.css';

/// Layout
import Nav from './layouts/nav';
import Footer from './layouts/Footer';

/// Pages
import Registration from './pages/Registration';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import LockScreen from './pages/LockScreen';
import Error400 from './pages/Error400';
import Error403 from './pages/Error403';
import Error404 from './pages/Error404';
import Error500 from './pages/Error500';
import Error503 from './pages/Error503';
/// Widget
import Widget from './pages/Widget';

/// Deshboard
import Home from './components/Dashboard/Home';
import WorkoutStatistic from './components/Dashboard/WorkoutStatistic';
import WorkoutPlan from './components/Dashboard/WorkoutPlan';
import DistanceMap from './components/Dashboard/DistanceMap';
import DietFoodMenu from './components/Dashboard/DietFoodMenu';
import PersonalRecord from './components/Dashboard/PersonalRecord';

/// Bo
import UiAlert from './components/bootstrap/Alert';
import UiAccordion from './components/bootstrap/Accordion';
import UiBadge from './components/bootstrap/Badge';
import UiButton from './components/bootstrap/Button';
import UiModal from './components/bootstrap/Modal';
import UiButtonGroup from './components/bootstrap/ButtonGroup';
import UiListGroup from './components/bootstrap/ListGroup';
import UiMediaObject from './components/bootstrap/MediaObject';
import UiCards from './components/bootstrap/Cards';
import UiCarousel from './components/bootstrap/Carousel';
import UiDropDown from './components/bootstrap/DropDown';
import UiPopOver from './components/bootstrap/PopOver';
import UiProgressBar from './components/bootstrap/ProgressBar';
import UiTab from './components/bootstrap/Tab';
import UiPagination from './components/bootstrap/Pagination';
import UiGrid from './components/bootstrap/Grid';
import UiTypography from './components/bootstrap/Typography';

/// App
import AppProfile from './components/AppsMenu/AppProfile/AppProfile';
import Compose from './components/AppsMenu/Email/Compose/Compose';
import Inbox from './components/AppsMenu/Email/Inbox/Inbox';
import Read from './components/AppsMenu/Email/Read/Read';
import Calendar from './components/AppsMenu/Calendar/Calendar';
import PostDetails from './components/AppsMenu/AppProfile/PostDetails';

/// Product List
import ProductGrid from './components/AppsMenu/Shop/ProductGrid/ProductGrid';
import ProductList from './components/AppsMenu/Shop/ProductList/ProductList';
import ProductDetail from './components/AppsMenu/Shop/ProductGrid/ProductDetail';
import Checkout from './components/AppsMenu/Shop/Checkout/Checkout';
import Invoice from './components/AppsMenu/Shop/Invoice/Invoice';
import ProductOrder from './components/AppsMenu/Shop/ProductOrder';
import Customers_ from './components/AppsMenu/Shop/Customers/Customers';

/// Chirt
import SparklineChart from './components/charts/Sparkline';
import ChartJs from './components/charts/Chartjs';
import Chartist from './components/charts/chartist';

import BtcChart from './components/charts/apexcharts/ApexChart';

/// Table
import DataTable from './components/table/DataTable';
import BootstrapTable from './components/table/BootstrapTable';
import ApexChart from './components/charts/apexcharts';

/// Form
import Element from './components/Forms/Element/Element';
import Wizard from './components/Forms/Wizard/Wizard';
import SummerNote from './components/Forms/Summernote/SummerNote';
import Pickers from './components/Forms/Pickers/Pickers';
import jQueryValidation from './components/Forms/jQueryValidation/jQueryValidation';

/// Pulgin
import Select2 from './components/PluginsMenu/Select2/Select2';
import Nestable from './components/PluginsMenu/Nestable/Nestable';
import MainNouiSlider from './components/PluginsMenu/Noui Slider/MainNouiSlider';
import MainSweetAlert from './components/PluginsMenu/Sweet Alert/SweetAlert';
import Toastr from './components/PluginsMenu/Toastr/Toastr';
import JqvMap from './components/PluginsMenu/Jqv Map/JqvMap';
import RechartJs from './components/charts/rechart';
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
import Inventory from './pages/inventory';

/// Pages
// const Registration = React.lazy(() => import('./pages/Registration'));
// const Login = React.lazy(() => import('./pages/Login'));
// const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
// const LockScreen = React.lazy(() => import('./pages/LockScreen'));
// const Error400 = React.lazy(() => import('./pages/Error400'));
// const Error403 = React.lazy(() => import('./pages/Error403'));
// const Error404 = React.lazy(() => import('./pages/Error404'));
// const Error500 = React.lazy(() => import('./pages/Error500'));
// const Error503 = React.lazy(() => import('./pages/Error503'));
// /// Widget
// const Widget = React.lazy(() => import('./pages/Widget'));

// /// Deshboard
// const Home = React.lazy(() => import('./components/Dashboard/Home'));
// const WorkoutStatistic = React.lazy(() => import('./components/Dashboard/WorkoutStatistic'));
// const WorkoutPlan = React.lazy(() => import('./components/Dashboard/WorkoutPlan'));
// const DistanceMap = React.lazy(() => import('./components/Dashboard/DistanceMap'));
// const DietFoodMenu = React.lazy(() => import('./components/Dashboard/DietFoodMenu'));
// const PersonalRecord = React.lazy(() => import('./components/Dashboard/PersonalRecord'));

// /// Bo
// const UiAlert = React.lazy(() => import('./components/bootstrap/Alert'));
// const UiAccordion = React.lazy(() => import('./components/bootstrap/Accordion'));
// const UiBadge = React.lazy(() => import('./components/bootstrap/Badge'));
// const UiButton = React.lazy(() => import('./components/bootstrap/Button'));
// const UiModal = React.lazy(() => import('./components/bootstrap/Modal'));
// const UiButtonGroup = React.lazy(() => import('./components/bootstrap/ButtonGroup'));
// const UiListGroup = React.lazy(() => import('./components/bootstrap/ListGroup'));
// const UiMediaObject = React.lazy(() => import('./components/bootstrap/MediaObject'));
// const UiCards = React.lazy(() => import('./components/bootstrap/Cards'));
// const UiCarousel = React.lazy(() => import('./components/bootstrap/Carousel'));
// const UiDropDown = React.lazy(() => import('./components/bootstrap/DropDown'));
// const UiPopOver = React.lazy(() => import('./components/bootstrap/PopOver'));
// const UiProgressBar = React.lazy(() => import('./components/bootstrap/ProgressBar'));
// const UiTab = React.lazy(() => import('./components/bootstrap/Tab'));
// const UiPagination = React.lazy(() => import('./components/bootstrap/Pagination'));
// const UiGrid = React.lazy(() => import('./components/bootstrap/Grid'));
// const UiTypography = React.lazy(() => import('./components/bootstrap/Typography'));

// /// App
// const AppProfile = React.lazy(() => import('./components/AppsMenu/AppProfile/AppProfile'));
// const Compose = React.lazy(() => import('./components/AppsMenu/Email/Compose/Compose'));
// const Inbox = React.lazy(() => import('./components/AppsMenu/Email/Inbox/Inbox'));
// const Read = React.lazy(() => import('./components/AppsMenu/Email/Read/Read'));
// const Calendar = React.lazy(() => import('./components/AppsMenu/Calendar/Calendar'));
// const PostDetails = React.lazy(() => import('./components/AppsMenu/AppProfile/PostDetails'));

// /// Product List
// const ProductGrid = React.lazy(() => import('./components/AppsMenu/Shop/ProductGrid/ProductGrid'));
// const ProductList = React.lazy(() => import('./components/AppsMenu/Shop/ProductList/ProductList'));
// const ProductDetail = React.lazy(() => import('./components/AppsMenu/Shop/ProductGrid/ProductDetail'));
// const Checkout = React.lazy(() => import('./components/AppsMenu/Shop/Checkout/Checkout'));
// const Invoice = React.lazy(() => import('./components/AppsMenu/Shop/Invoice/Invoice'));
// const ProductOrder = React.lazy(() => import('./components/AppsMenu/Shop/ProductOrder'));
// const Customers = React.lazy(() => import('./components/AppsMenu/Shop/Customers/Customers'));

// /// Chirt
// const SparklineChart = React.lazy(() => import('./components/charts/Sparkline'));
// const ChartJs = React.lazy(() => import('./components/charts/Chartjs'));
// const Chartist = React.lazy(() => import('./components/charts/chartist'));

// const BtcChart = React.lazy(() => import('./components/charts/apexcharts/ApexChart'));

// /// Table
// const DataTable = React.lazy(() => import('./components/table/DataTable'));
// const BootstrapTable = React.lazy(() => import('./components/table/BootstrapTable'));
// const ApexChart = React.lazy(() => import('./components/charts/apexcharts'));

// /// Form
// const Element = React.lazy(() => import('./components/Forms/Element/Element'));
// const Wizard = React.lazy(() => import('./components/Forms/Wizard/Wizard'));
// const SummerNote = React.lazy(() => import('./components/Forms/Summernote/SummerNote'));
// const Pickers = React.lazy(() => import('./components/Forms/Pickers/Pickers'));
// const jQueryValidation = React.lazy(() => import('./components/Forms/jQueryValidation/jQueryValidation'));

// /// Pulgin
// const Select2 = React.lazy(() => import('./components/PluginsMenu/Select2/Select2'));
// const Nestable = React.lazy(() => import('./components/PluginsMenu/Nestable/Nestable'));
// const MainNouiSlider = React.lazy(() => import('./components/PluginsMenu/Noui Slider/MainNouiSlider'));
// const MainSweetAlert = React.lazy(() => import('./components/PluginsMenu/Sweet Alert/SweetAlert'));
// const Toastr = React.lazy(() => import('./components/PluginsMenu/Toastr/Toastr'));
// const JqvMap = React.lazy(() => import('./components/PluginsMenu/Jqv Map/JqvMap'));
// const RechartJs = React.lazy(() => import('./components/charts/rechart'));
// const Layout = React.lazy(() => import('./layouts'));

const protectedRoutes = [
   { url: 'employees', component: Employees },
   { url: 'dashboard', component: Dashboard },
   { url: 'employees/:id', component: EmployeeActions },
];

const routes = [
   /// Deshborad
   { url: '', component: () => <Redirect to="/page-login" /> },
   // { url: 'dashboard', component: Dashboard },
   // { url: 'workout-statistic', component: WorkoutStatistic },
   // { url: 'workout-plan', component: WorkoutPlan },
   // { url: 'distance-map', component: DistanceMap },
   // { url: 'diet-food-menu', component: DietFoodMenu },
   // { url: 'personal-record', component: PersonalRecord },
   // /// Bootstrap
   // { url: 'ui-alert', component: UiAlert },
   // { url: 'ui-badge', component: UiBadge },
   // { url: 'ui-button', component: UiButton },
   // { url: 'ui-modal', component: UiModal },
   // { url: 'ui-button-group', component: UiButtonGroup },
   // { url: 'ui-accordion', component: UiAccordion },
   // { url: 'ui-list-group', component: UiListGroup },
   // { url: 'ui-media-object', component: UiMediaObject },
   // { url: 'ui-card', component: UiCards },
   // { url: 'ui-carousel', component: UiCarousel },
   // { url: 'ui-dropdown', component: UiDropDown },
   // { url: 'ui-popover', component: UiPopOver },
   // { url: 'ui-progressbar', component: UiProgressBar },
   // { url: 'ui-tab', component: UiTab },
   // { url: 'ui-pagination', component: UiPagination },
   // { url: 'ui-typography', component: UiTypography },
   // { url: 'ui-grid', component: UiGrid },
   // /// Apps
   // { url: 'app-profile', component: AppProfile },
   // { url: 'email-compose', component: Compose },
   // { url: 'email-inbox', component: Inbox },
   // { url: 'email-read', component: Read },
   // { url: 'app-calender', component: Calendar },
   // { url: 'post-details', component: PostDetails },
   // /// Shop
   // { url: 'ecom-product-grid', component: ProductGrid },
   // { url: 'ecom-product-list', component: ProductList },
   // { url: 'ecom-product-detail', component: ProductDetail },
   // { url: 'ecom-product-order', component: ProductOrder },
   // { url: 'ecom-checkout', component: Checkout },
   // { url: 'ecom-invoice', component: Invoice },
   // { url: 'ecom-product-detail', component: ProductDetail },
   // { url: 'ecom-customers', component: Customers_ },

   // /// Chart
   // { url: 'chart-sparkline', component: SparklineChart },
   // { url: 'chart-chartjs', component: ChartJs },
   // { url: 'chart-chartist', component: Chartist },
   // { url: 'chart-btc', component: BtcChart },
   // { url: 'chart-apexchart', component: ApexChart },
   // { url: 'chart-rechart', component: RechartJs },

   // /// table
   // { url: 'table-datatable-basic', component: DataTable },
   // { url: 'table-bootstrap-basic', component: BootstrapTable },

   // /// Form
   // { url: 'form-element', component: Element },
   // { url: 'form-wizard', component: Wizard },
   // { url: 'form-wizard', component: Wizard },
   // { url: 'form-editor-summernote', component: SummerNote },
   // { url: 'form-pickers', component: Pickers },
   // { url: 'form-validation-jquery', component: jQueryValidation },

   // /// Plugin

   // { url: 'uc-select2', component: Select2 },
   // { url: 'uc-nestable', component: Nestable },
   // { url: 'uc-noui-slider', component: MainNouiSlider },
   // { url: 'uc-sweetalert', component: MainSweetAlert },
   // { url: 'uc-toastr', component: Toastr },
   // { url: 'map-jqvmap', component: JqvMap },

   /// pages
   // { url: 'widget-basic', component: Widget },

   { url: 'page-register', component: Registration, isPublic: true },
   // { url: 'page-lock-screen', component: LockScreen, isPublic: true },
   { url: 'page-login', component: Login, isPublic: true },
   { url: 'page-forgot-password', component: ForgotPassword, isPublic: true },
   { url: 'page-error-400', component: Error400, isPublic: true },
   { url: 'page-error-403', component: Error403, isPublic: true },
   { url: 'page-error-404', component: Error404, isPublic: true },
   { url: 'page-error-500', component: Error500, isPublic: true },
   { url: 'page-error-503', component: Error503, isPublic: true },

   // { url: 'employees', component: Employees },
   // { url: 'employees/:id', component: EmployeeActions },
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
   { url: 'inventory', component: Inventory },
];

const Markup = (props) => (
   <Suspense fallback={<p>Loading</p>}>
      <Router>
         {/* <div id="main-wrapper" className="show">
         <Nav /> */}

         {/* <div className="content-body">
            <div className="container-fluid"> */}
         <Switch>
            <If condition={props.user?.type === 'cashier'}>
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
         {/* </div>
         </div>

         <Footer />
      </div> */}
      </Router>
   </Suspense>
);

const mapStateToProps = ({ auth }) => ({
   user: auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Markup);
