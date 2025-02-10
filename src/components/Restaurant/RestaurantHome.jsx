import React,{useState,useEffect} from 'react'
import respic from '../../assets/respic.avif'
import respic1 from '../../assets/respic1.avif'
import respic2 from '../../assets/respic2.avif'
import respic3 from '../../assets/respic3.avif'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { Outlet, useLocation } from "react-router-dom";



const RestaurantHome = () => {
    const [User, setUser] = useState({})
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const restaurant_id = searchParams.get("restaurant_id");
    console.log("residin home ",restaurant_id);

    useEffect(() => {
        if (!restaurant_id) return;
    
        const fetchUserDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:5001/api/restaurant/users/${restaurant_id}`, {
               // Pass _id in query parameters
              withCredentials: true, // Ensures cookies are sent if needed
            });
          
            setUser(response.data);
          } catch (err) {
            console.log(err)
          }
        };
    
        fetchUserDetails();
      }, [restaurant_id]);
      console.log('reshomeuseeffect',User);
      
       
  return (
  <>
 
    
    <div className='flex-grow  py-10 overflow-scroll ' >
    
        <div className="bg-black container mx-auto items-center flex justify-around flex-col md:flex-row sm:flex-row">
            <img src={respic} alt="" className="p-1 max-w-[500px] max-h-[500px]" />
            <div className="items-center justify-center text-white h-96 text-center font-bold mb-3 mt-6">
            <h1 className="sm:text-lg md:text-xl lg:text-3xl xl:text-4xl mb-2">Welcome</h1>
            <h2 className="sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2">to</h2>
            <h1 className="sm:text-lg md:text-2xl lg:text-3xl xl:text-5xl mb-2">Foodie Buddie</h1>
            <p className="mb-10">We are here to serve our kings</p>
            {!restaurant_id?<button className="bg-orange-500 p-3 rounded-lg">
                <NavLink to="/restaurant/signup?role=restaurant">ADD RESTAURANT</NavLink>
            </button>:null}
            </div>
        </div>
        

        <div className='flex flex-col items-center w-full justify-center gap-11 mt-4'>
            <div className='mx-auto flex w-full items-center gap-1 px-4 justify-center mt-6 text-3xl font-bold'>
                
                <div className='sm:text-lg md:text-xl lg:text-3xl xl:text-4xl text-center'>Why Should You Partner With Foodie Buddie ?</div>
                
            </div>
            <div className='flex mx-auto  flex-col md:flex-row sm:flex-row  mt-5 gap-3 '>
                <div className='flex  flex-col items-center justify-center p-4 text-center'>
                    <img src={respic1} alt="" className='h-24 '/>
                    <div>Attract new customers</div>
                    <div>reach the millions of peoples ordering on Foddie Buddie</div>

                </div>
                <div className='flex  flex-col items-center justify-center p-4 text-center'>
                    <img src={respic2} alt="" className='h-24 '/>
                    <div>Door step delivery</div>
                    <div>Easy to deliver your food by our partners</div>


                </div>
                <div className='flex flex-col  items-center justify-center p-4 text-center'>
                    <img src={respic3} alt="" className='h-24 '/>
                    <div>All time support</div>
                    <div>Ready to assist on calls on time </div>

                </div>
            </div>
        </div>

    </div>
   

  
  </>
  )
}

export default RestaurantHome