import { Wrapper } from "@googlemaps/react-wrapper";
import './App.css';
import { useEffect, useRef, useState } from "react";

const propertyDetails = require('./propertyDetails.json');

function App() {
  return (
    <Wrapper apiKey={"AIzaSyDJ9421MXFa_SDtRbnmrWJd_34Xg5cmgrM"}>
      <MyMapComponent center={{lng: -84.441, lat: 38.054}} zoom={18} />
    </Wrapper>
  );
}

function MyMapComponent({ center, zoom }) {
  const ref = useRef();
  const [map, setMap] = useState(null);
  const [infoContent, setInfoContent] = useState(null);

  useEffect(() => {
    const newMap = new window.google.maps.Map(ref.current, {
      center,
      zoom,
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
    });

    newMap.data.loadGeoJson('/parcels.geojson');

    newMap.data.setStyle(function (feature) {
      const streetNumber = feature.getProperty('NUM1');
      let color;
      switch (streetNumber) {
        case '114':
        case '104':
        case '106':
        case '108':
        case '110':
        case '3001':
        case '3061':
          color = 'red'; // SHOWPROP PICO RIVERA LLC
          break;
        default:
          color = 'blue';
      }
      console.log(streetNumber, color);
      return {
        fillColor: color,
        strokeWeight: 2,
        strokeColor: 'whitesmoke',
        fillOpacity: 0.25,
        clickable: true,
      };
    });

    newMap.data.addListener('click', function (event) {
      const address = event.feature.getProperty('NUM1');
      const position = event.latLng;
      setInfoContent({ address, position });
    });

    setMap(newMap);
  }, [center, zoom]);

  const getColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'green';
      case 'B':
        return 'blue';
      case 'C':
        return 'yellow';
      case 'D':
        return 'red';
    }
  };

  useEffect(() => {
    if (!map || !infoContent) return;

    const { address, position } = infoContent;

    let propertyDetail = propertyDetails.find((detail) => detail["Location Address"].includes(address));
    const infowindow = new window.google.maps.InfoWindow({
      content: `<div style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px' }}>
          <h3>${propertyDetail["Location Address"]}</h3>
          <ul>
            ${Object.entries(propertyDetail).map(([key, value]) => (`
              <li key="${key}">
                <strong>${key}: </strong>
                ${value}
              </li>
            `)).join("")}
          </ul>
    </div>`,
    });
    const projection = map.getProjection();
    const pixelPosition = projection?.fromLatLngToPoint(position);
    if(!pixelPosition) {
      return;
    }
    const newPixelPosition = new window.google.maps.Point(
      pixelPosition.x,
      pixelPosition.y
    );
    console.log(position)
    const newPosition = projection.fromPointToLatLng(newPixelPosition);
    infowindow.setPosition(newPosition);
    infowindow.open(map);

    return () => {
      infowindow.close();
    };
  }, [infoContent, map]);

  return (
    <>
      <header>
        <a href="#" onClick={() => map.setCenter({lng: -84.441, lat: 38.054})}>Augusta Arms</a>|||
        <a href="#" onClick={() => map.setCenter({lng: -84.556, lat: 38.0152})}>Beaumont</a>
      </header>
      <div style={{ height: '90vh', width: '100vw' }} ref={ref} id="map" />
    </>
  );
}

export default App;
