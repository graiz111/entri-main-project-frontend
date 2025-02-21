import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedinIn, 
  FaPhoneAlt,
  FaEnvelope 
} from "react-icons/fa"

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://facebook.com/foodiebuddie" },
    { icon: <FaInstagram />, href: "https://instagram.com/foodiebuddie" },
    { icon: <FaTwitter />, href: "https://twitter.com/foodiebuddie" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com/company/foodiebuddie" }
  ];

  const quickLinks = [
    { name: "Home"},
    { name: "Menu"},
    { name: "About Us"},
    { name: "Contact"}
  ];

  const legalLinks = [
    { name: "Privacy Policy"},
    { name: "Terms of Service"},
    { name: "Refund Policy"}
  ];

  return (
    <footer className={`
      ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-900'}
      py-12 px-12 md:px-12 
    `}>
      <div className="container mx-auto  grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            Foodie Buddie
          </h2>
          <p className={`text-sm mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Delivering delightful dining experiences right to your doorstep.
          </p>
          
          <div className="flex space-x-3 mt-6">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`
                  p-2 rounded-full transition-colors duration-300
                  ${theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-green-400' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-green-600'}
                `}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

       
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link, index) => (
              <li key={index}
                  className={`
                    transition-colors duration-300
                    ${theme === 'dark' 
                      ? 'text-gray-400 hover:text-green-400' 
                      : 'text-gray-600 hover:text-green-600'}
                  `}
              
              >
                {link.name}
               
              </li>
            ))}
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            {legalLinks.map((link, index) => (
              <li key={index}
                  className={`
                    transition-colors duration-300
                    ${theme === 'dark' 
                      ? 'text-gray-400 hover:text-green-400' 
                      : 'text-gray-600 hover:text-green-600'}
                  `}
               
              >
               
                {link.name}
              </li>
            ))}
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FaPhoneAlt className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                +91 9656527665
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                support@foodiebuddie.com
              </span>
            </div>
          </div>
        </div>
      </div>

      
      <div className={`
        text-center text-sm mt-12 pt-6 border-t
        ${theme === 'dark' 
          ? 'border-gray-700 text-gray-500' 
          : 'border-gray-300 text-gray-500'}
      `}>
        &copy; {new Date().getFullYear()} Foodie Buddie. All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer
// import React from 'react'
// import { FaFacebookF } from "react-icons/fa6";
// import { FaInstagram } from "react-icons/fa6";
// import { FaTwitter } from "react-icons/fa";
// import { CiMail } from "react-icons/ci";


// const Footer = () => {
//   return (
//     <>
//    <footer className="bg-gray-900 text-white py-10 px-5 md:px-20">
//   <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
//     <div>
//       <h2 className="text-2xl font-bold">Foodie Buddie</h2>
//       <p className="text-sm mt-2">Discover the best food & drinks around you.</p>
//     </div>
    
//     <div>
//       <h3 className="text-lg font-semibold">Company</h3>
//       <ul className="mt-2 space-y-2">
//         <li><a href="#" className="hover:text-gray-400">About</a></li>
//         <li><a href="#" className="hover:text-gray-400">Careers</a></li>
//         <li><a href="#" className="hover:text-gray-400">Contact</a></li>
//       </ul>
//     </div>
    
//     <div>
//       <h3 className="text-lg font-semibold">Support</h3>
//       <ul className="mt-2 space-y-2">
//         <li><a href="#" className="hover:text-gray-400">Help Center</a></li>
//         <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
//         <li><a href="#" className="hover:text-gray-400">Terms & Conditions</a></li>
//       </ul>
//     </div>
    
//     <div className='flex flex-col items-center justify-center'>
//       <h3 className="text-lg font-semibold ">Follow Us</h3>
//       <div className="flex space-x-4 mt-2">
//         <a href="#" className="text-gray-400 hover:text-white"><FaFacebookF/></a>
//         <a href="#" className="text-gray-400 hover:text-white"><FaInstagram/></a>
//         <a href="#" className="text-gray-400 hover:text-white"><FaTwitter/></a>
//         <a href="#" className="text-gray-400 hover:text-white"><CiMail/></a>
//       </div>
//     </div>
//   </div>
  
//   <div className="text-center text-sm text-gray-400 mt-8 border-t border-gray-700 pt-4">
//     &copy; 2025 Foodie. All rights reserved.
//   </div>
// </footer>
  
  
//   <script src="https://kit.fontawesome.com/YOUR_KIT_CODE.js" crossOrigin="anonymous"></script>

//   </>
//   )
// }

// export default Footer