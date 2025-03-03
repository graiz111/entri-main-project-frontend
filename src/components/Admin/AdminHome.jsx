// import React from 'react';
// import { NavLink, useLocation } from "react-router-dom";
// import { Building2, Users, BarChart3, Shield } from "lucide-react";

// const AdminHome = () => {

//   return (
//     <div className="bg-gradient-to-b from-gray-50 to-gray-100">
//       {/* Hero Section */}
//       <div className="container mx-auto px-4 py-16">
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Welcome to Admin Dashboard
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Manage your organization efficiently with our comprehensive admin tools and analytics
//           </p>
//         </div>

//         {/* Feature Boxes */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
//             <div className="flex items-center space-x-4">
//               <Users className="h-8 w-8 text-blue-600" />
//               <div>
//                 <h3 className="text-lg font-semibold">User Management</h3>
//                 <p className="text-gray-600">Manage user accounts and permissions</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
//             <div className="flex items-center space-x-4">
//               <BarChart3 className="h-8 w-8 text-green-600" />
//               <div>
//                 <h3 className="text-lg font-semibold">Analytics</h3>
//                 <p className="text-gray-600">Track performance metrics</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
//             <div className="flex items-center space-x-4">
//               <Shield className="h-8 w-8 text-purple-600" />
//               <div>
//                 <h3 className="text-lg font-semibold">Security</h3>
//                 <p className="text-gray-600">Monitor and manage security settings</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
//             <div className="flex items-center space-x-4">
//               <Building2 className="h-8 w-8 text-orange-600" />
//               <div>
//                 <h3 className="text-lg font-semibold">Organization</h3>
//                 <p className="text-gray-600">Configure organization settings</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Login Section */}
//         <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
//           <h2 className="text-2xl font-bold text-center mb-6">Login to Continue</h2>
//           <NavLink 
//             to={`/admin/login?role=admin`}
//             className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors"
//           >
//             Go to Login
//           </NavLink>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AdminHome;

import React, { useContext } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { Building2, Users, BarChart3, Shield } from "lucide-react";
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from '../../context/ThemeToggle';

const AdminHome = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`bg-gradient-to-b ${theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-gray-50 to-gray-100'}`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            Welcome to Admin Dashboard
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Manage your organization efficiently with our comprehensive admin tools and analytics
          </p>
        </div>

        {/* Feature Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className={`p-6 rounded-lg shadow hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>User Management</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Manage user accounts and permissions</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Analytics</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Track performance metrics</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Security</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Monitor and manage security settings</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Organization</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Configure organization settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className={`rounded-lg shadow-md p-8 max-w-md mx-auto ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Login to Continue</h2>
          <NavLink 
            to={`/admin/login?role=admin`}
            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Login
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
