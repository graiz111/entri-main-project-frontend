
import React,{useEffect,useState} from 'react';
import { axiosInstance } from '../utils/axios';
import { createBrowserRouter,  RouterProvider, useNavigate } from 'react-router-dom';

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
import AdminUserHome from '../components/Admin/AdminUserHome';
import AdminRestaurant from '../components/Admin/adminRestaurant';
import AdminUsers from '../components/Admin/AdminUsers';
import AdminDelivery from '../components/Admin/AdminDelivery';
// import AdminEdit from '../components/Admin/AdminEdit';

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
import AdminUserLayout from '../layouts/AdminUserLayout';
import CheckOut from '../components/common/CheckOut';
import Success from '../components/common/Success';
import Failure from '../components/common/Failure';
import DeliveryUserLayout from '../layouts/DeliveryUserLayout';
import DeliveryUserHome from '../components/Delivery/DeliveryUserHome';
import SuccessPage from '../components/common/SuccessPage';
import Unauthorized from '../components/common/Unauthorised';
import CouponManagement from '../components/Admin/AdminCoupon';




// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const [auth, setAuth] = useState(null);
//   const navigate = useNavigate(); // Assuming you're using react-router

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         const response = await axiosInstance.get("/auth/verify-token");
        
//         if (response.data.success) {
//           const userRole = response.data.role;
          
//           if (allowedRoles.includes(userRole)) {
//             setAuth(true);
//           } else {
//             setAuth(false);
//             navigate('/unauthorized'); // Redirect to unauthorized page
//           }
//         } else {
//           setAuth(false);
//           navigate('/'); // Redirect to login
//         }
//       } catch (error) {
//         setAuth(false);
//         navigate('/'); // Redirect to login on error
//       }
//     };
    
//     verifyToken();
//   }, [allowedRoles, navigate]);

//   if (auth === null) {
//     return <div>Loading...</div>; // Or a nicer loading component
//   }

//   return auth ? children : null;
// };

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  const verifyToken = async () => {
    try {
      const response = await axiosInstance.get("/auth/verify-token");
      
      if (response.data.success  ) {
        const userRole = response.data.role;
        
        if (allowedRoles.includes(userRole)) {
          setAuth(true);
        } else {
          setAuth(false);
          navigate('/unauthorized');
        }
      } else {
        setAuth(false);
        navigate('/unauthorized', { replace: true });
        // navigate('/', { replace: true });
      }
    } catch (error) {
      
      console.error("Token verification failed:", error);
      setAuth(false);
      // navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    verifyToken();
    
    const handleFocus = () => verifyToken();
    window.addEventListener('focus', handleFocus);
    
 
    const handlePopState = () => verifyToken();
    window.addEventListener('popstate', handlePopState);
    
  
    const handlePageShow = (event) => {
      if (event.persisted) {
       
        verifyToken();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [allowedRoles, navigate]);

  
  if (auth === null) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  return auth ? children : null;
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
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "user/:userId/user/payment/success", element: <Success /> },
      { path: "user/payment/cancel", element: <Failure /> },
      { path: "order/success/:orderId/:userId", element: <SuccessPage /> },
    ],
  },
  {
    path: "user/:_id/:role",
    element: <UserLayout />, // ✅ Always accessible
    children: [
      { index: true, element: <ProtectedRoute allowedRoles={["user"]}><UserHome /></ProtectedRoute> },
      { path: "orders", element: <ProtectedRoute allowedRoles={["user"]}><UserOrders /></ProtectedRoute> },
      { path: "userhome", element: <ProtectedRoute allowedRoles={["user"]}><UserHome /></ProtectedRoute> },
      { path: "userresmenu/:restaurant_id/:_id", element: <ProtectedRoute allowedRoles={["user"]}><UseresMenu/></ProtectedRoute> },
      { path: "usercart/:userId", element: <ProtectedRoute allowedRoles={["user"]}><Cart /></ProtectedRoute> },
      { path: "addaddress", element: <ProtectedRoute allowedRoles={["user"]}><UserAddress /></ProtectedRoute> },
      { path: "editprofile", element: <ProtectedRoute allowedRoles={["user"]}><EditProfile /></ProtectedRoute> },
      { path: "checkout/:userId/:cartId", element: <ProtectedRoute allowedRoles={["user"]}><CheckOut /></ProtectedRoute> },
    
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
      {
        path:"user/:_id/:role",
        element: <ProtectedRoute allowedRoles={["admin"]}><AdminUserLayout/></ProtectedRoute>, 
        children:[
          {index:true,element:<AdminUserHome/>},
          { path: "admrestaurant", element: <AdminRestaurant />},
          { path: "admusers", element: <AdminUsers />},
          { path: "admdelivery", element: <AdminDelivery />},
          { path: "addcoupons", element: <CouponManagement />},
          { path: "editprofile", element: <EditProfile />},
          { path: "about-us", element: <AboutUs /> },
        ],

      }

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
  },

  {
    path: "/delivery",
    element: <DeliveryLayout />, // ✅ Always accessible
    children: [
      { index: true, element:<DeliveryHome />},
      { path: "login", element: <Login /> },
    { path: "signup", element: <Signup /> },
    {
      path: "user/:_id/:role",
      element: <ProtectedRoute allowedRoles={["delivery"]}><DeliveryUserLayout/></ProtectedRoute>,
      children:[
        { index: true, element: <DeliveryUserHome /> },
        { path: "orders", element: <DeliveryOrders />},
        { path: "settings", element:<SettingsPage />},
        { path: "editprofile", element: <EditProfile /> },
        { path: "about-us", element: <AboutUs /> },
      ]
    }


    ],
  },
]);



const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;

