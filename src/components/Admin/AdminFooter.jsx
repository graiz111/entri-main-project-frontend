import React from 'react'
import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { CiMail } from "react-icons/ci";


const AdminFooter = () => {
  return (
    <>
    <div className='bg-gray-500 h-fit flex items-center justify-center'>
       <div className=' container flex mx-auto  flex-col md:flex-row sm:flex-row justify-around  mt-5 '>
                      <div className='flex  flex-col items-center justify-center p-4 text-center'>
                          <div className='font-bold text-lg'>Foodie Buddie</div>
                          <div className='mt-3'> here to server</div>
      
                      </div>
                      <div className='flex  flex-col items-center justify-center p-4 text-center'>
                          <div className='font-bold text-lg'>Contact</div>
                          <div className='flex gap-2 mt-2'>
                            <FaFacebookF />
                            <FaInstagram />
                            <FaTwitter />
                            <CiMail />
                          </div>
      
      
                      </div>
                      <div className='flex flex-col  items-center justify-center p-4 text-center'>
                          <div className='font-bold text-lg'>Learn more</div>
                          <div>privacy</div>
                          <div>terms and condition</div>
                          <div>security</div>
                          


      
                      </div>
                  </div>

    </div>
    </>
  )
}

export default AdminFooter