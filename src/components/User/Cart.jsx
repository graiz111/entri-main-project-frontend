import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash, FaTimes } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null); // Store restaurant ID of first item

  // Add item to cart (with restaurant check)
  const addItemToCart = (item) => {
    if (cart.length === 0) {
      setRestaurantId(item.restaurant_id); // Set restaurant_id for the first item
    } else if (item.restaurant_id !== restaurantId) {
      alert("You can only add items from the same restaurant!");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart(cart.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Remove item
  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);

    // If cart becomes empty, reset restaurantId
    if (updatedCart.length === 0) {
      setRestaurantId(null);
    }
  };

  // Calculate total price
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto bg-white p-4 rounded-xl shadow-md relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">CART</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md" />
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <button onClick={() => decreaseQuantity(item.id)} className="p-1 bg-gray-200 rounded-full">
                    <FaMinus size={12} />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)} className="p-1 bg-gray-200 rounded-full">
                    <FaPlus size={12} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500 ml-4">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <>
            <div className="mt-4 text-right">
              <p className="text-lg font-bold">Total: ${total}</p>
            </div>
            <button
              onClick={() => alert("Proceeding to Payment...")}
              className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg font-semibold"
            >
              Proceed to Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaPlus, FaMinus, FaTrash, FaTimes } from "react-icons/fa";

// const Cart = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState([
//     {
//       id: 1,
//       name: "Burger",
//       price: 5.99,
//       quantity: 1,
//       restaurant: "McDonald's",
//       image: "https://via.placeholder.com/100",
//     },
//     {
//       id: 2,
//       name: "Fries",
//       price: 2.99,
//       quantity: 1,
//       restaurant: "McDonald's",
//       image: "https://via.placeholder.com/100",
//     },
//   ]);

//   // Calculate total price
//   const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

//   // Increase quantity
//   const increaseQuantity = (id) => {
//     setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
//   };

//   // Decrease quantity
//   const decreaseQuantity = (id) => {
//     setCart(cart.map(item =>
//       item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
//     ));
//   };

//   // Remove item
//   const removeItem = (id) => {
//     setCart(cart.filter(item => item.id !== id));
//   };

//   return (
//     <div className=" p-4 ">
     
//       <div className="max-w-lg mx-auto bg-white p-4 rounded-xl shadow-md relative">

//         <button
//             onClick={() => navigate(-1)}
//             className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
//         >
//             <FaTimes size={24} />
//         </button>
//         <h2 className="text-xl font-bold mb-4">CART</h2>

//         {cart.length === 0 ? (
//           <p className="text-gray-500">Your cart is empty.</p>
//         ) : (
//           <div className="space-y-4">
//             {cart.map((item) => (
//               <div key={item.id} className="flex items-center justify-between border-b pb-2">
//                 <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md" />
//                 <div className="flex-1 ml-4">
//                   <h3 className="font-semibold">{item.name}</h3>
//                   <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
//                 </div>
//                 <div className="flex items-center">
//                   <button onClick={() => decreaseQuantity(item.id)} className="p-1 bg-gray-200 rounded-full">
//                     <FaMinus size={12} />
//                   </button>
//                   <span className="mx-2">{item.quantity}</span>
//                   <button onClick={() => increaseQuantity(item.id)} className="p-1 bg-gray-200 rounded-full">
//                     <FaPlus size={12} />
//                   </button>
//                 </div>
//                 <button onClick={() => removeItem(item.id)} className="text-red-500 ml-4">
//                   <FaTrash />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {cart.length > 0 && (
//           <>
//             <div className="mt-4 text-right">
//               <p className="text-lg font-bold">Total: ${total}</p>
//             </div>
//             <button
//               onClick={() => alert("Proceeding to Payment...")}
//               className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg font-semibold"
//             >
//               Proceed to Payment
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;
