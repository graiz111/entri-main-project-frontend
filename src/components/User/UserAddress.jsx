import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import axios from 'axios';

// Replace this with your actual Google Maps API key
const googleMapsApiKey = 'AIzaSyC-uXbRo_ktTFGbYbJhnpMTAr8HDRI5JUc';

const UserAddress = () => {
  const [address, setAddress] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle changes in the manual address input
  const handleManualAddressChange = (e) => {
    setManualAddress(e.target.value);
  };

  // Handle map selection (when user picks a location)
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });

    // Reverse geocoding to get address from lat, lng
    reverseGeocode(lat, lng);
  };

  // Reverse geocoding: Get address from latitude and longitude
  const reverseGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        alert('Could not retrieve address');
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Data to submit (could be saved to MongoDB or any backend)
    const addressData = {
      address: manualAddress || address,
      coordinates: markerPosition,
    };

    try {
      // Replace with your actual endpoint
      await axios.post('/api/addresses', addressData);
      alert('Address added successfully');
    } catch (error) {
      alert('Error adding address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="  p-6 ">
      <div className="max-w-3xl mx-auto bg-green-100 shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Add Your Address</h2>

        <form onSubmit={handleSubmit}>
          {/* Manual Address Input */}
          <div className="mb-4">
            <label htmlFor="manualAddress" className="block text-lg font-medium">Manual Address</label>
            <input
              id="manualAddress"
              type="text"
              value={manualAddress}
              onChange={handleManualAddressChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="Enter your address"
            />
          </div>

          {/* Google Maps Input */}
          <div className="mb-4">
            <label htmlFor="googleMap" className="block text-lg font-medium">Select Location on Map</label>
            <div className="h-64 mt-2">
              <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  zoom={15}
                  center={markerPosition || { lat: 40.7128, lng: -74.0060 }} // Default center to NYC
                  onClick={handleMapClick}
                >
                  {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>

          {/* Display address */}
          {address && (
            <div className="mb-4">
              <p className="text-lg font-medium">Selected Address: {address}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isLoading ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAddress;
