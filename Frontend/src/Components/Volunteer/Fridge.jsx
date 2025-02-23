// import React, { useEffect, useRef } from 'react';

// const Fridge = () => {
//   const mapContainerRef = useRef(null);

//   useEffect(() => {
//     const loadGoogleMap = () => {
//       // Make sure the script is loaded and the API is ready
//       if (window.google && window.google.maps) {
//         new window.google.maps.Map(mapContainerRef.current, {
//           center: { lat: 19.076, lng: 72.8777 }, // Mumbai coordinates
//           zoom: 12,
//         });
//       }
//     };

//     // Load the Google Maps script dynamically
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAJ3KUzqKJfvZeJ5TsYzK00stAtFP_tZS8&callback=loadGoogleMap`;
//     script.async = true;
//     document.body.appendChild(script);

//     // Global callback to initialize the map
//     window.loadGoogleMap = loadGoogleMap;

//     // Cleanup the script when the component unmounts
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div className="bg-white shadow rounded-lg flex flex-col items-center text-center border border-black relative h-70 overflow-hidden">
//       {/* Google Map will be inserted here */}
//       <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
//     </div>
//   );
// };

// export default Fridge;

import React, { useEffect, useRef } from 'react';

const Fridge = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const loadGoogleMap = () => {
      // Make sure the script is loaded and the API is ready
      if (window.google && window.google.maps) {
        new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: 19.076, lng: 72.8777 }, // Mumbai coordinates
          zoom: 12,
        });
      }
    };

    // Load the Google Maps script dynamically
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAJ3KUzqKJfvZeJ5TsYzK00stAtFP_tZS8&callback=loadGoogleMap`;
    script.async = true;
    document.body.appendChild(script);

    // Global callback to initialize the map
    window.loadGoogleMap = loadGoogleMap;

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-white shadow rounded-lg flex flex-col items-center text-center border border-black relative h-70 overflow-hidden z-10">
      {/* Google Map will be inserted here */}
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default Fridge;