const socket = io();
const zoomLevel = 13;

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (err) => {
      console.error(err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
    }
  );
}

var map = L.map("map").setView([0, 0], zoomLevel);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Coding Ninjas",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  map.setView([latitude, longitude], zoomLevel);
  if (markers[id]) {
    markers[id].setLatLong([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude] , {draggable:true}).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
