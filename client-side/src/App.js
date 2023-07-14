import React, { useEffect, useState } from "react";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppemEtMiIsImEiOiJjbGsxaHBuZmYwNmtwM3JwanJsbzVzMmdjIn0.NRZIVsGWCMAclKqpvHMyOg";
  
const App = () => {
  const [earthquakeData, setEarthquakeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/display-data");
        setEarthquakeData(response.data.features);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(earthquakeData);
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [100, -2],
      zoom: 5,
  });

          // Adding navigation controls to the map
  map.addControl(new mapboxgl.NavigationControl());
  earthquakeData.forEach((earthquake) => {
    const { coordinates } = earthquake.geometry;
    const longitude = coordinates[0];
    const latitude = coordinates[1];
    const { dateTime, region, magnitude } = earthquake.properties;

          // Creating a marker
  const marker = new mapboxgl.Marker()
  .setLngLat([longitude, latitude])
  .setPopup(
      new mapboxgl.Popup().setHTML(
        `<strong>Date & Time:</strong> ${new Date(dateTime)}<br/>
         <strong>Region:</strong> ${region}<br/>
         <strong>Magnitude:</strong> ${magnitude}`
      )
    );
     marker.addTo(map);
  });
    return () => map.remove();
  }, [earthquakeData]);

  return <div id="map" style={{ width: "100%", height: "900px" }} />;
};

export default App;
