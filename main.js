import * as leaflet from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";

var map = leaflet.map("map").setView([39.8282, -98.5696], 5);

leaflet
  .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  })
  .addTo(map);

const layers = new Map([
  [
    "wwa",
    leaflet.tileLayer.wms(
      "https://mapservices.weather.noaa.gov/eventdriven/services/WWA/watch_warn_adv/MapServer/WMSServer",
      {
        layers: "0,1",
        format: "image/png",
        transparent: true,
      },
    ),
  ],
  [
    "radar",
    leaflet.tileLayer.wms(
      "https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows",
      {
        layers: "conus_bref_qcd",
        format: "image/png",
        transparent: true,
      },
    ),
  ],
]);

let activeLayer = layers.get("wwa");
activeLayer.addTo(map);

map.on("click", (e) => {
  const {
    latlng: { lat, lng },
  } = e;
  document.location = `https://beta.weather.gov/point/${lat}/${lng}`;
});

Array.from(document.querySelectorAll("button[data-product]")).forEach(
  (button) => {
    button.addEventListener(
      "click",
      ({
        target: {
          dataset: { product },
        },
      }) => {
        const layer = layers.get(product);
        if (layer) {
          if (activeLayer) {
            activeLayer.remove(map);
          }
          activeLayer = layer;
          layer.addTo(map);
        }
      },
    );
  },
);
