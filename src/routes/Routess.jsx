import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import RestaurantLayout from '../layouts/RestaurantLayout';
import DeliveryLayout from '../layouts/DeliveryLayout';
import UserLayout from '../layouts/UserLayout';

// Main Components
import Main from '../components/Main/Main';
import AboutUs from '../components/common/AboutUs';
import ContactUs from '../components/common/ContactUs';
import Login from '../components/common/Login';
import Signup from '../components/common/Signup';
import EditProfile from '../components/common/EditProfile';
import SettingsPage from '../components/common/Setting';

// Admin Components
import AdminHome from '../components/Admin/AdminHome';
import AdminRestaurant from '../components/Admin/adminRestaurant';
import AdminUsers from '../components/Admin/AdminUsers';
import AdminDelivery from '../components/Admin/AdminDelivery';
import AdminEdit from '../components/Admin/AdminEdit';

// Restaurant Components
import RestaurantHome from '../components/Restaurant/RestaurantHome';
import RestaurantMenu from '../components/Restaurant/RestaurantMenu';
import RestaurantOrders from '../components/Restaurant/RestaurantOrders';

// Delivery Components
import DeliveryHome from '../components/Delivery/DeliveryHome';
import DeliveryOrders from '../components/Delivery/DeliveryOrders';

// User Components
import UserHome from '../components/User/UserHome';
import UserOrders from '../components/User/UserOrders';
import UserAddress from '../components/User/UserAddress';
import Cart from '../components/User/Cart';
import UseresMenu from '../components/User/UserresMenu';
import RestaurantUserLayout from '../layouts/RestaurantUserLayout';
import RestaurantUserHome from '../components/Restaurant/RestaurantUserHome';





const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/auth/verify-token", {
          withCredentials: true,
        });

        if (response.data.success) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (error) {
        setAuth(false);
      }
    };

    verifyToken();
  }, []);

  if (auth === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return auth ? children : <Navigate to="/" />;
};



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // ✅ Always accessible
    children: [
      { index: true, element: <Main /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "about-us", element: <AboutUs /> },
    ],
  },
  {
    path: "user/:_id/:role",
    element: <UserLayout />, // ✅ Always accessible
    children: [
      { index: true, element: <ProtectedRoute allowedRoles={["user"]}><UserHome /></ProtectedRoute> },
      { path: "orders", element: <ProtectedRoute allowedRoles={["user"]}><UserOrders /></ProtectedRoute> },
      { path: "userresmenu/:restaurant_id", element: <ProtectedRoute allowedRoles={["user"]}><UseresMenu/></ProtectedRoute> },
      { path: "usercart/:userId", element: <ProtectedRoute allowedRoles={["user"]}><Cart /></ProtectedRoute> },
      { path: "addaddress", element: <ProtectedRoute allowedRoles={["user"]}><UserAddress /></ProtectedRoute> },
      { path: "editprofile", element: <ProtectedRoute allowedRoles={["user"]}><EditProfile /></ProtectedRoute> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "about-us", element: <AboutUs /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />, // ✅ Always accessible
    children: [
      { index: true, element: <AdminHome /> },
      { path: "login", element: <Login /> },
    { path: "signup", element: <Signup /> },
      { path: "admrestaurant", element: <ProtectedRoute allowedRoles={["admin"]}><AdminRestaurant /></ProtectedRoute> },
      { path: "admusers", element: <ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute> },
      { path: "admdelivery", element: <ProtectedRoute allowedRoles={["admin"]}><AdminDelivery /></ProtectedRoute> },
      { path: "admdedit", element: <ProtectedRoute allowedRoles={["admin"]}><AdminEdit /></ProtectedRoute> },
      { path: "settings", element: <ProtectedRoute allowedRoles={["admin"]}><SettingsPage /></ProtectedRoute> },
      { path: "editprofile", element: <ProtectedRoute allowedRoles={["admin"]}><EditProfile /></ProtectedRoute> },
      { path: "about-us", element: <AboutUs /> },
    ],
  },
  {
    path: "/restaurant",
    element: <RestaurantLayout />,
    children: [
      { index: true, element: <RestaurantHome /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "about-us", element: <AboutUs /> },
      { path: "contact-us", element: <ContactUs /> },
  
      
      {
        path: "user/:_id/:role",
        element: <ProtectedRoute allowedRoles={["restaurant"]}><RestaurantUserLayout/></ProtectedRoute>, // ✅ Parent Layout for /restaurant/user
        children: [
          { index: true, element: <RestaurantUserHome /> },
          { path: "menu", element: <RestaurantMenu /> },
          { path: "orders", element: <RestaurantOrders /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "editprofile", element: <EditProfile /> },
          { path: "contact-us", element: <ContactUs /> },
        ],
      },
    ],
  }
  
  
  
  
  ,
  
  // {
  //   path: "/restaurant",
  //   element: <RestaurantLayout />, // ✅ Always accessible
  //   children: [
  //     { index: true, element:<RestaurantHome />},
  //     { path: "login", element: <Login /> },
  //   { path: "signup", element: <Signup /> },
  //     { path: "menu", element: <ProtectedRoute allowedRoles={["restaurant"]}><RestaurantMenu /></ProtectedRoute> },
  //     { path: "orders", element: <ProtectedRoute allowedRoles={["restaurant"]}><RestaurantOrders /></ProtectedRoute> },
  //     { path: "settings", element: <ProtectedRoute allowedRoles={["restaurant"]}><SettingsPage /></ProtectedRoute> },
  //     { path: "editprofile", element: <ProtectedRoute allowedRoles={["restaurant"]}><EditProfile /></ProtectedRoute> },
  //     { path: "about-us", element: <AboutUs /> },
  //   ],
  // },
  {
    path: "/delivery",
    element: <DeliveryLayout />, // ✅ Always accessible
    children: [
      { index: true, element:<DeliveryHome />},
      { path: "login", element: <Login /> },
    { path: "signup", element: <Signup /> },
      { path: "delorders", element: <ProtectedRoute allowedRoles={["delivery"]}><DeliveryOrders /></ProtectedRoute> },
      { path: "settings", element: <ProtectedRoute allowedRoles={["delivery"]}><SettingsPage /></ProtectedRoute> },
      { path: "editprofile", element: <ProtectedRoute allowedRoles={["delivery"]}><EditProfile /></ProtectedRoute> },
      { path: "about-us", element: <AboutUs /> },
    ],
  },
]);



const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;

