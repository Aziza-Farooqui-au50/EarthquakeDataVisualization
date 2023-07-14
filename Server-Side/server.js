const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
const Earthquake = require("./model/earthquake");
require("dotenv").config();

const app = express();
app.use(cors());

// Connect  MongoDB

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/get-data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json"
    );
    const data = response.data.Infogempa.gempa;
    const earthquakes = data.map((item) => ({
      dateTime: parseDateTime(item.Tanggal, item.Jam),
      region: item.Wilayah,
      magnitude: parseFloat(item.Magnitude),
      latitude: parseFloat(item.Lintang),
      longitude: parseFloat(item.Bujur),
    }));
    await Earthquake.insertMany(earthquakes);
    res.json({ message: "Data fetched and stored successfully" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch and store data" });
  }
});

function parseDateTime(dateString, timeString) {
  const [day, month, year] = dateString.split("/");
  const [hour, minute, second] = timeString.split(":");
}

app.get("/display-data", async (req, res) => {
  try {
    const earthquakes = await Earthquake.find({}, { _id: 0, __v: 0 });

    // Convert the data to GeoJSON format
    const geoJSON = {
      type: "FeatureCollection",
      features: earthquakes.map((earthquake) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [earthquake.longitude, earthquake.latitude],
        },
        properties: {
          dateTime: earthquake.dateTime,
          region: earthquake.region,
          magnitude: earthquake.magnitude,
        },
      })),
    };
    res.json(geoJSON);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
