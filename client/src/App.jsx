import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { io } from "socket.io-client"
// import L from 'leaflet'

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });

        // Initialize map if not already initialized
        if (!map) {
          map = L.map('map').setView([0, 0], 16);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);
        } else {
          // map.setView([latitude, longitude]);
        }
      },
        (error) => {
          console.log(error)
        }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    }

    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
    const markers={}
    socket.on("recived-location", ({id,latitude,longitude})=>{
      // console.log("recived-location", latitude, longitude);
      map.setView([latitude,longitude],18)
      if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
      }
      else{
         markers[id] = L.marker([latitude, longitude]).addTo(map);
      }
    });

    socket.on("user-disconnected",({id})=>{
      console.log("user disconnected",id)
    })
    socket.on("welcome", (msg) => {
      console.log(msg);
    });
  }, [socket]);

  let map;

  return (
    <>
      <div className='map' id='map' ></div>
    </>
  );
}

export default App;
