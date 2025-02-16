import React,{useState} from 'react'
import delpic2 from '../../assets/delpic2.jpeg'
import respic1 from '../../assets/respic1.avif'
import respic2 from '../../assets/respic2.avif'
import respic3 from '../../assets/respic3.avif'


const DeliveryUserHome = () => {
        
       
  return (
  <>
 
    
    <div className='flex-grow  py-10 overflow-scroll ' >
        <div className='bg-black container m-auto mx-auto items-center  flex justify-around flex-col md:flex-row sm:flex-row' >
            
                <img src={delpic2} alt="" className='p-1 max-w-[500px] max-h-[500px] '/>
                <div className=' items-center justify-center text-white h-96 text-center font-bold mb-3 mt-6 '>
                    <h1 className='sm:text-lg md:text-xl lg:text-3xl xl:text-4xl mb-2'>Welcome</h1>
                    <h2 className='sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2'>to</h2>
                    <h1 className='sm:text-lg md:text-2xl lg:text-3xl xl:text-5xl mb-2'>Foodie Buddie</h1>
                    <p className='mb-10'>we are here to server our kings</p>
                    <p className='mb-5'>signup and start serving</p>



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

export default DeliveryUserHome