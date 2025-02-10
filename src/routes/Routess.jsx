// import React from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import MainLayout from '../layouts/MainLayout';
// import AdminLayout from '../layouts/AdminLayout';
// import RestaurantLayout from '../layouts/RestaurantLayout';
// import DeliveryLayout from '../layouts/DeliveryLayout';
// import UserLayout from '../layouts/UserLayout';

// import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute

// import Main from '../components/Main/Main';
// import UserHome from '../components/User/UserHome';
// import UserOrders from '../components/User/UserOrders';
// import UserAddress from '../components/User/UserAddress';
// import Cart from '../components/User/Cart';
// import UserLogin from '../components/common/Login';
// import UserSignup from '../components/common/Signup';
// import SettingsPage from '../components/common/Setting';
// import ContactUs from '../components/common/ContactUs';

// import AdminHome from '../components/Admin/AdminHome';
// import AdminRestaurant from '../components/Admin/adminRestaurant';
// import AdminUsers from '../components/Admin/AdminUsers';

// import RestaurantHome from '../components/Restaurant/RestaurantHome';
// import RestaurantMenu from '../components/Restaurant/RestaurantMenu';
// import RestaurantOrders from '../components/Restaurant/RestaurantOrders';

// import DeliveryHome from '../components/Delivery/DeliveryHome';
// import DeliveryOrders from '../components/Delivery/DeliveryOrders';
// import AdminDelivery from '../components/Admin/AdminUsers';
// import AdminEdit from '../components/Admin/AdminEdit';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       { index: true, element: <Main /> },
//       { path: "contact-us", element: <ContactUs /> },
//       { path: "login", element: <UserLogin /> },
//       { path: "signup", element: <UserSignup /> },
//     ]
//   },
//   {
//     path: "/user",
//     element: <UserLayout />,
//     children: [
//       {
//         element: <ProtectedRoute allowedRoles={["user"]}/>, // Protect routes for the user
//         children: [
//           { index: true, element: <UserHome /> },
//           { path: "orders", element: <UserOrders /> },
//           { path: "usercart", element: <Cart /> },
//           { path: "addaddress", element: <UserAddress /> },
//           { path: "settings", element: <SettingsPage /> }
//         ]
//       }
//     ]
//   },
//   {
//     path: "/admin",
//     element: <AdminLayout />,
//     children: [
//       {
//         element: <ProtectedRoute allowedRoles={["admin"]} />, // Protect admin routes
//         children: [
//           { index: true, element: <AdminHome /> },
//           { path: "admrestaurant", element: <AdminRestaurant /> },
//           { path: "admusers", element: <AdminUsers /> },
//           { path: "admdelivery", element: <AdminDelivery/> },
//           { path: "admdedit", element: <AdminEdit/> },
//         ]
//       }
//     ]
//   },
//   {
//     path: "/restaurant",
//     element: <RestaurantLayout />,
//     children: [
//       {
//         element: <ProtectedRoute allowedRoles={["restaurant"]} />, // Protect restaurant routes
//         children: [
//           { index: true, element: <RestaurantHome /> },
//           { path: "menu", element: <RestaurantMenu /> },
//           { path: "orders", element: <RestaurantOrders /> },
//         ]
//       }
//     ]
//   },
//   {
//     path: "/delivery",
//     element: <DeliveryLayout />,
//     children: [
//       {
//         element: <ProtectedRoute allowedRoles={["delivery"]} />, // Protect delivery routes
//         children: [
//           { index: true, element: <DeliveryHome /> },
//           { path: "delorders", element: <DeliveryOrders /> },
//         ]
//       }
//     ]
//   }
// ]);

// const Routes = () => {
//   return <RouterProvider router={router} />;
// };

// export default Routes;

// import React from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute'; // Import Protected Route

// import MainLayout from '../layouts/MainLayout';
// import AdminLayout from '../layouts/AdminLayout';
// import RestaurantLayout from '../layouts/RestaurantLayout';
// import DeliveryLayout from '../layouts/DeliveryLayout';
// import UserLayout from '../layouts/UserLayout';

// import Main from '../components/Main/Main';
// import AdminHome from '../components/Admin/AdminHome';
// import AdminRestaurant from '../components/Admin/adminRestaurant';
// import AdminUsers from '../components/Admin/AdminUsers';
// import AdminDelivery from '../components/Admin/AdminDelivery';
// import AdminEdit from '../components/Admin/AdminEdit';
// import RestaurantHome from '../components/Restaurant/RestaurantHome';
// import RestaurantMenu from '../components/Restaurant/RestaurantMenu';
// import RestaurantOrders from '../components/Restaurant/RestaurantOrders';
// import DeliveryHome from '../components/Delivery/DeliveryHome';
// import DeliveryOrders from '../components/Delivery/DeliveryOrders';
// import UserHome from '../components/User/UserHome';
// import ContactUs from '../components/common/ContactUs';
// import UserOrders from '../components/User/UserOrders';
// import UserAddress from '../components/User/UserAddress';
// import Cart from '../components/User/Cart';
// import UserLogin from '../components/common/UserLogin';
// import UserSignup from '../components/common/UserSignup';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       { index: true, element: <Main /> },  // Main page
//       { path: "contact-us", element: <ContactUs /> },
//       { path: "login", element: <UserLogin /> }, // Login available here
//       { path: "signup", element: <UserSignup /> }, // Signup available here
//     ]
//   },
//   {
//     path: "/user",
//     element: <UserLayout />,
//     children: [
//       {
//         element: <ProtectedRoute />, // Protect user routes
//         children: [
//           { index: true, element: <UserHome /> },
//           { path: "orders", element: <UserOrders /> },
//           { path: "usercart", element: <Cart /> },
//           { path: "addaddress", element: <UserAddress /> },
//         ]
//       }
//     ]
//   },
//   {
//     path: "/admin",
//     element: <AdminLayout />,
//     children: [
//       {
//         element: <ProtectedRoute />, // Protect admin routes
//         children: [
//           { index: true, element: <AdminHome /> },
//           { path: "admrestaurant", element: <AdminRestaurant /> },
//           { path: "admusers", element: <AdminUsers /> },
//           { path: "admdelivery", element: <AdminDelivery /> },
//           { path: "admdedit", element: <AdminEdit /> },
//         ]
//       }
//     ]
//   },
//   {
//     path: "/restaurant",
//     element: <RestaurantLayout />,
//     children: [
//       {
//         element: <ProtectedRoute />, // Protect restaurant routes
//         children: [
//           { index: true, element: <RestaurantHome /> },
//           { path: "menu", element: <RestaurantMenu /> },
//           { path: "orders", element: <RestaurantOrders /> },
//         ]
//       }
//     ]
//   },
//   {
//     path: "/delivery",
//     element: <DeliveryLayout />,
//     children: [
//       {
//         element: <ProtectedRoute />, // Protect delivery routes
//         children: [
//           { index: true, element: <DeliveryHome /> },
//           { path: "delorders", element: <DeliveryOrders /> },
//         ]
//       }
//     ]
//   }
// ]);

// const Routes = () => {
//   return <RouterProvider router={router} />;
// };

// export default Routes;

//

// routes/Routes.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import RestaurantLayout from '../layouts/RestaurantLayout';
import DeliveryLayout from '../layouts/DeliveryLayout';
import UserLayout from '../layouts/UserLayout';

import Main from '../components/Main/Main';
import AdminHome from '../components/Admin/AdminHome';

import AdminRestaurant from '../components/Admin/adminRestaurant';

import AdminUsers from '../components/Admin/AdminUsers';
import AdminDelivery from '../components/Admin/AdminDelivery';
import AdminEdit from '../components/Admin/AdminEdit';
import RestaurantHome from '../components/Restaurant/RestaurantHome';
import RestaurantMenu from '../components/Restaurant/RestaurantMenu';
import RestaurantOrders from '../components/Restaurant/RestaurantOrders';


import DeliveryHome from '../components/Delivery/DeliveryHome';


import DeliveryOrders from '../components/Delivery/DeliveryOrders';
import UserHome from '../components/User/UserHome';
import Login from '../components/common/Login';
import Signup from '../components/common/Signup';
import SettingsPage from '../components/common/Setting';
import ContactUs from '../components/common/ContactUs';
import UserOrders from '../components/User/UserOrders';
import UserAddress from '../components/User/UserAddress';
import Cart from '../components/User/Cart';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Main /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ]
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { index: true, element: <UserHome /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "settings", element: <SettingsPage/> },
      { path: "orders", element: <UserOrders /> },
      { path: "usercart", element: <Cart/> },
      { path: "addaddress", element: <UserAddress /> },
      // { path: "addaddress", element: <UserAddress /> },

      
      
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminHome /> },
      // { path: "settings", element: <AdminSettings /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "admrestaurant", element: <AdminRestaurant /> },
      { path: "admusers", element: <AdminUsers /> },
      { path: "admdelivery", element: <AdminDelivery/> },
      { path: "admdedit", element: <AdminEdit/> },
      { path: "settings", element: <SettingsPage/> },


      

    ]
  },
  {
    path: "/restaurant",
    element: <RestaurantLayout />,
    children: [
      { index: true, element: <RestaurantHome /> },
      { path: "login", element: <Login /> },
      { path: "menu", element: <RestaurantMenu /> },
      { path: "orders", element: <RestaurantOrders /> },
      { path: "settings", element: <SettingsPage/> },
      { path: "signup", element: <Signup /> },
      { path: "contact-us", element: <ContactUs /> },

    ]
  },
  {
    path: "/delivery",
    element: <DeliveryLayout />,
    children: [
      { index: true, element: <DeliveryHome /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "delorders", element: <DeliveryOrders/> },
      { path: "settings", element: <SettingsPage/> },
      { path: "contact-us", element: <ContactUs /> },



    ]
  }
  
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
