import React from 'react'
import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { CiMail } from "react-icons/ci";


const Footer = () => {
  return (
    <>
   <footer className="bg-gray-900 text-white py-10 px-5 md:px-20">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
    <div>
      <h2 className="text-2xl font-bold">Foodie Buddie</h2>
      <p className="text-sm mt-2">Discover the best food & drinks around you.</p>
    </div>
    
    <div>
      <h3 className="text-lg font-semibold">Company</h3>
      <ul className="mt-2 space-y-2">
        <li><a href="#" className="hover:text-gray-400">About</a></li>
        <li><a href="#" className="hover:text-gray-400">Careers</a></li>
        <li><a href="#" className="hover:text-gray-400">Contact</a></li>
      </ul>
    </div>
    
    <div>
      <h3 className="text-lg font-semibold">Support</h3>
      <ul className="mt-2 space-y-2">
        <li><a href="#" className="hover:text-gray-400">Help Center</a></li>
        <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
        <li><a href="#" className="hover:text-gray-400">Terms & Conditions</a></li>
      </ul>
    </div>
    
    <div className='flex flex-col items-center justify-center'>
      <h3 className="text-lg font-semibold ">Follow Us</h3>
      <div className="flex space-x-4 mt-2">
        <a href="#" className="text-gray-400 hover:text-white"><FaFacebookF/></a>
        <a href="#" className="text-gray-400 hover:text-white"><FaInstagram/></a>
        <a href="#" className="text-gray-400 hover:text-white"><FaTwitter/></a>
        <a href="#" className="text-gray-400 hover:text-white"><CiMail/></a>
      </div>
    </div>
  </div>
  
  <div className="text-center text-sm text-gray-400 mt-8 border-t border-gray-700 pt-4">
    &copy; 2025 Foodie. All rights reserved.
  </div>
</footer>
  
  
  <script src="https://kit.fontawesome.com/YOUR_KIT_CODE.js" crossOrigin="anonymous"></script>

  </>
  )
}

export default Footer