import React, { useState } from 'react';
import { Outlet, useLocation } from "react-router-dom";

import userpic from '../../assets/userpic.jpg';
import respic1 from '../../assets/respic1.avif';
import respic2 from '../../assets/respic2.avif';
import respic3 from '../../assets/respic3.avif';

const UserHome = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const _id = searchParams.get("user_id");
    console.log("userid in home", _id);

    const dummyRestaurants = [
        { name: "Pizza Palace", description: "Best Italian Pizzas in town", items: ["Margherita", "Pepperoni", "BBQ Chicken"] },
        { name: "Sushi Delight", description: "Authentic Japanese Sushi", items: ["California Roll", "Spicy Tuna", "Dragon Roll"] },
        { name: "Burger Hub", description: "Juicy & Tasty Burgers", items: ["Cheese Burger", "Veggie Burger", "Double Patty"] }
    ];

    return (
        <div className='bg-slate-100 overflow-scroll'>
            {/* New section for fetching restaurants and items
            <div className='w-full p-4 bg-white shadow-md text-center text-lg font-semibold'>
                <div className='text-2xl font-bold mb-2'>Fetching Restaurants & Items</div>
                <div className='text-gray-600'>Loading top-rated restaurants and delicious food items...</div>
                <div className='flex  items-center gap-4 mt-4  max-w-96'>
                    {dummyRestaurants.map((restaurant, index) => (
                        <div key={index} className='p-4 border rounded-md shadow-md bg-gray-100 w-80'>
                            <img src={restaurant.image}/>
                            <div className='text-xl font-semibold'>{restaurant.name}</div>
                            <div className='text-gray-600'>{restaurant.description}</div>
                            <div className='mt-2 text-sm text-gray-800'>
                                <span className='font-bold'>Popular Items:</span> {restaurant.items.join(", ")}
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
            
            <div className='flex flex-col items-center w-full justify-center gap-11 mt-4'>
                <div className='mx-auto flex w-full items-center gap-1 px-4 justify-center mt-6 text-3xl font-bold'>
                    <div className='sm:text-lg md:text-xl lg:text-3xl xl:text-4xl text-center'>We are serving millions like you</div>
                </div>
                <div className='flex mx-auto flex-col md:flex-row sm:flex-row mt-5 gap-3'>
                    <div className='flex flex-col items-center justify-center p-4 text-center'>
                        <img src={respic1} alt='' className='h-24' />
                        <div>Millions of users</div>
                        <div>Reached the millions by people ordering on Foodie Buddie</div>
                    </div>
                    <div className='flex flex-col items-center justify-center p-4 text-center'>
                        <img src={respic2} alt='' className='h-24' />
                        <div>Doorstep delivery</div>
                        <div>You rest with your loved ones, we serve you</div>
                    </div>
                    <div className='flex flex-col items-center justify-center p-4 text-center'>
                        <img src={respic3} alt='' className='h-24' />
                        <div>All-time support</div>
                        <div>Ready to assist on calls on time</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
// import React,{useState} from 'react'
// import { Outlet, useLocation } from "react-router-dom";

// import userpic from '../../assets/userpic.jpg'
// import respic1 from '../../assets/respic1.avif'
// import respic2 from '../../assets/respic2.avif'
// import respic3 from '../../assets/respic3.avif'


// const UserHome = () => {


//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const _id = searchParams.get("user_id");
//   console.log("useridin home ",_id);
  
        
       
     
//   return (
 
  
//     <div className=' bg-slate-100  overflow-scroll ' >
//             <div>
                
//             </div>
//             <div className='flex flex-col items-center w-full justify-center gap-11 mt-4'>
//                 <div className='mx-auto flex w-full items-center gap-1 px-4 justify-center mt-6 text-3xl font-bold'>
                    
//                     <div className='sm:text-lg md:text-xl lg:text-3xl xl:text-4xl text-center'>We are serving millions like you </div>
                    
//                 </div>
//                 <div className='flex mx-auto  flex-col md:flex-row sm:flex-row  mt-5 gap-3 '>
//                     <div className='flex  flex-col items-center justify-center p-4 text-center'>
//                         <img src={respic1} alt="" className='h-24 '/>
//                         <div>Millions of users</div>
//                         <div>reached the millions by peoples ordering on Foddie Buddie</div>
    
//                     </div>
//                     <div className='flex  flex-col items-center justify-center p-4 text-center'>
//                         <img src={respic2} alt="" className='h-24 '/>
//                         <div>Door step delivery</div>
//                         <div>you rest with your loved ones we serve you </div>
    
    
//                     </div>
//                     <div className='flex flex-col  items-center justify-center p-4 text-center'>
//                         <img src={respic3} alt="" className='h-24 '/>
//                         <div>All time support</div>
//                         <div>Ready to assist on calls on time </div>
    
//                     </div>
//                 </div>
//             </div>
    
//     </div>
   

  
  
//   )
// }

// export default UserHome