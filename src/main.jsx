// index.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import store from '../src/redux/Store.js'
import { Provider } from 'react-redux'
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import { RestaurantAuthProvider } from "./context/RestaurantAuthContext";
import { DeliveryAuthProvider } from "./context/DeliveryAuthContext";
import { UserAuthProvider } from "./context/UserAuthContext";
 

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
  <AdminAuthProvider>
    <RestaurantAuthProvider>
      <DeliveryAuthProvider>
        <UserAuthProvider>
          <App />
        </UserAuthProvider>
      </DeliveryAuthProvider>
    </RestaurantAuthProvider>
  </AdminAuthProvider>,
  </Provider>,
)
