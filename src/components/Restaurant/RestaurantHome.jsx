
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import respic from '../../assets/respic.avif';
import respic1 from '../../assets/respic1.avif';
import respic2 from '../../assets/respic2.avif';
import respic3 from '../../assets/respic3.avif';
import { ThemeContext } from '../../context/ThemeContext';



const FeatureCard = ({ image, title, description, theme }) => (
  <div className={`flex flex-col items-center p-6 rounded-xl transition-all transform hover:scale-105 ${
    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
  } shadow-lg max-w-sm`}>
    <img src={image} alt={title} className="h-24 mb-4 object-contain" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
      {description}
    </p>
  </div>
);

const RestaurantHome = () => {
 
 const { theme } = useContext(ThemeContext);






  const features = [
    {
      image: respic1,
      title: "Attract New Customers",
      description: "Reach the millions of peoples ordering on Foodie Buddie"
    },
    {
      image: respic2,
      title: "Door Step Delivery",
      description: "Easy to deliver your food by our partners"
    },
    {
      image: respic3,
      title: "All Time Support",
      description: "Ready to assist on calls on time"
    }
  ];

  return (
    <div className={`flex-grow  container pb-9 pt-5 mx-auto ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <section className={`${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-900'
      } py-20`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <img
                src={respic}
                alt="Restaurant Hero"
                className="rounded-2xl shadow-2xl max-w-full h-auto"
              />
            </div>
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to
                <span className="block text-orange-500 mt-2">Foodie Buddie</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                We are here to serve our kings
              </p>
              {(
                <NavLink
                  to="/restaurant/signup?role=restaurant"
                  className="inline-block bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-transform hover:scale-105 hover:bg-orange-600"
                >
                  ADD RESTAURANT
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Should You Partner With Foodie Buddie?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                image={feature.image}
                title={feature.title}
                description={feature.description}
                theme={theme}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-orange-50'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Grow Your Restaurant Business?
          </h2>
         
            <NavLink
              to="/restaurant/signup?role=restaurant"
              className="inline-block bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-transform hover:scale-105 hover:bg-orange-600"
            >
              Join Foodie Buddie Today
            </NavLink>
         
        </div>
      </section>
    </div>
  );
};

export default RestaurantHome;



















































// import React,{useState,useEffect} from 'react'
// import respic from '../../assets/respic.avif'
// import respic1 from '../../assets/respic1.avif'
// import respic2 from '../../assets/respic2.avif'
// import respic3 from '../../assets/respic3.avif'
// import { NavLink } from 'react-router-dom'
// import axios from 'axios'
// import { Outlet, useLocation } from "react-router-dom";



// const RestaurantHome = () => {
//     const [User, setUser] = useState({})
//     const location = useLocation();
//     const searchParams = new URLSearchParams(location.search);
//     const restaurant_id = searchParams.get("restaurant_id");
//     console.log("residin home ",restaurant_id);

//     useEffect(() => {
//         if (!restaurant_id) return;
    
//         const fetchUserDetails = async () => {
//           try {
//             const response = await axios.get(`http://localhost:5001/api/restaurant/users/${restaurant_id}`, {
//                // Pass _id in query parameters
//               withCredentials: true, // Ensures cookies are sent if needed
//             });
          
//             setUser(response.data);
//           } catch (err) {
//             console.log(err)
//           }
//         };
    
//         fetchUserDetails();
//       }, [restaurant_id]);
//       console.log('reshomeuseeffect',User);
      
       
//   return (
//   <>
 
    
//     <div className='flex-grow  py-10 overflow-scroll ' >
    
//         <div className="bg-black container mx-auto items-center flex justify-around flex-col md:flex-row sm:flex-row">
//             <img src={respic} alt="" className="p-1 max-w-[500px] max-h-[500px]" />
//             <div className="items-center justify-center text-white h-96 text-center font-bold mb-3 mt-6">
//             <h1 className="sm:text-lg md:text-xl lg:text-3xl xl:text-4xl mb-2">Welcome</h1>
//             <h2 className="sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2">to</h2>
//             <h1 className="sm:text-lg md:text-2xl lg:text-3xl xl:text-5xl mb-2">Foodie Buddie</h1>
//             <p className="mb-10">We are here to serve our kings</p>
//             {!restaurant_id?<button className="bg-orange-500 p-3 rounded-lg">
//                 <NavLink to="/restaurant/signup?role=restaurant">ADD RESTAURANT</NavLink>
//             </button>:null}
//             </div>
//         </div>
        

//         <div className='flex flex-col items-center w-full justify-center gap-11 mt-4'>
//             <div className='mx-auto flex w-full items-center gap-1 px-4 justify-center mt-6 text-3xl font-bold'>
                
//                 <div className='sm:text-lg md:text-xl lg:text-3xl xl:text-4xl text-center'>Why Should You Partner With Foodie Buddie ?</div>
                
//             </div>
//             <div className='flex mx-auto  flex-col md:flex-row sm:flex-row  mt-5 gap-3 '>
//                 <div className='flex  flex-col items-center justify-center p-4 text-center'>
//                     <img src={respic1} alt="" className='h-24 '/>
//                     <div>Attract new customers</div>
//                     <div>reach the millions of peoples ordering on Foddie Buddie</div>

//                 </div>
//                 <div className='flex  flex-col items-center justify-center p-4 text-center'>
//                     <img src={respic2} alt="" className='h-24 '/>
//                     <div>Door step delivery</div>
//                     <div>Easy to deliver your food by our partners</div>


//                 </div>
//                 <div className='flex flex-col  items-center justify-center p-4 text-center'>
//                     <img src={respic3} alt="" className='h-24 '/>
//                     <div>All time support</div>
//                     <div>Ready to assist on calls on time </div>

//                 </div>
//             </div>
//         </div>

//     </div>
   

  
//   </>
//   )
// }

// export default RestaurantHome