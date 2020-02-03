import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Farms = React.lazy(() => import('./views/Farms'));
const FarmDetail = React.lazy(() => import('./views/Farms/Detail'));
const Customers = React.lazy(() => import('./views/Customers'));
const CustomerDetail = React.lazy(() => import('./views/Customers/Detail'));
const Setting = React.lazy(() => import('./views/Setting'));
const Configuration = React.lazy(() => import('./views/Configuration'));
const ActiveDrivers = React.lazy(() => import('./views/Driver/Active'));
const InactiveDrivers = React.lazy(() => import('./views/Driver/Inactive'));
const PendingDrivers = React.lazy(() => import('./views/Driver/Pending'));
const DriverDetail = React.lazy(() => import('./views/Driver/Detail'));
const Transaction = React.lazy(() => import('./views/Transaction'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', name: 'Home', component: DefaultLayout, exact: true },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/farms', name: 'Farms', component: Farms, exact: true },
  { path: '/farms/:id', name: 'Farm Detail', component: FarmDetail, exact: true },
  { path: '/active-drivers', name: 'Active Drivers', component: ActiveDrivers, exact: true },
  { path: '/active-drivers/:id', name: 'Driver Detail', component: DriverDetail },
  { path: '/inactive-drivers', name: 'Inactive Drivers', component: InactiveDrivers, exact: true },
  { path: '/inactive-drivers/:id', name: 'Driver Detail', component: DriverDetail },
  { path: '/pending-drivers', name: 'Pending Drivers', component: PendingDrivers, exact: true },
  { path: '/pending-drivers/:id', name: 'Driver Detail', component: DriverDetail },
  { path: '/customers', name: 'Customers', component: Customers, exact: true },
  { path: '/customers/:id', name: 'Customer Detail', component: CustomerDetail },
  { path: '/configuration', name: 'Configuration', component: Configuration },
  { path: '/transaction', name: 'Transaction', component: Transaction },
  { path: '/setting', name: 'Setting', component: Setting },
  
];

export default routes;
