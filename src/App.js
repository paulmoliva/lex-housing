import {Wrapper} from "@googlemaps/react-wrapper";
import './App.css';
import {useEffect, useRef, useState} from "react";
import {palette} from "./palette";

const propertyDetails = require('./propertyDetails.json');

const addresses = [
  "3001 LAKECREST CIR",
  "3061 FIELDSTONE WAY",
  "1842 AUGUSTA DR",
  "1807 AUGUSTA CT",
  "1633 RALEIGH RD",
  "1874 AUGUSTA DR",
  "1890 AUGUSTA DR",
  "1804 1812 AUGUSTA CT",
  "1804 AUGUSTA CT",
  "1812 AUGUSTA CT",
  "1644 RALEIGH RD",
  "1836 AUGUSTA DR",
  "1828 AUGUSTA DR",
  "1831 AUGUSTA DR",
  "1843 AUGUSTA DR",
  "1831 1843 AUGUSTA DR",
  "1800 AUGUSTA CT",
  "2210 GEORGETOWN RD",
  "2900 PALUMBO DR",
  "1851 SAHALEE DR",
  "1080 EXPORT ST",
  "5350 ATHENS BOONESBORO RD",
  "2401 RICHMOND RD",
  "2436 SANDERSVILLE RD",
  "3021 BROOKMONTE LN",
  "1171 PROVIDENCE PLACE PKWY",
  "2044 BRIDGEPORT DR",
  "2257 HARRODSBURG RD",
  "1289 BARLEYS PASS",
  "3509 BAY SPRINGS PARK",
  "298 SQUIRES CIR",
  "2370 CALENDULA RD",
  "1636 VILLA MEDICI PASS",
  "501 WHITE OAK TRCE",
  "505 WHITE OAK TRCE",
  "509 WHITE OAK TRCE",
  "513 WHITE OAK TRCE",
  "517 WHITE OAK TRCE",
  "1793 ATOMA DR",
  "1526 MCGRATHIANA PKWY",
  "3625 BARROW WOOD LN",
  "2400 SANDERSVILLE RD",
  "2204 SAVANNAH LN",
]

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
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [infoContent, setInfoContent] = useState(null);
  const [propertyIndex, setPropertyIndex] = useState(0);

  function gotoAddress(address) {
    console.log(address.toString())
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({
      'address': address + " LEXINGTON, KY"
    }, function(results, status) {
      if (status == window.google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        if (activeInfoWindow) {
          activeInfoWindow.close();
        }
        const window = setInfoWindow(address.toString().split(' ')[0]);
        setActiveInfoWindow(window)
        window.setPosition(results[0].geometry.location)
        window.open(map)
      }
    });
  }

  useEffect(() => {
    const newMap = new window.google.maps.Map(ref.current, {
      center,
      zoom,
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
    });

    newMap.data.loadGeoJson('/parcels.geojson');

    const colors = Object.keys(palette);
    let colorIndex = 0;
    console.log({colors, palette})
    const ownerColors = propertyDetails.reduce((acc, detail) => {
      if (acc[detail["Owner Name"]]) {
        return acc;
      }
      const result = {
        ...acc,
        [detail["Owner Name"]]: palette[colorIndex]//palette[colors[colorIndex % 9]]
      }
      colorIndex++;
      return result;
    }, {})

    newMap.data.setStyle(function (feature, i) {
      console.log({feature})
      const streetNumber = feature.getProperty('NUM1');
      const propertyDetail = propertyDetails.find((detail) => detail["Location Address"].toLowerCase().includes(streetNumber));
      console.log(ownerColors[propertyDetail["Owner Name"]]);
      return {
        fillColor: ownerColors[propertyDetail[["Owner Name"]]],//["800"],
        strokeWeight: 2,
        strokeColor: 'whitesmoke',
        fillOpacity: .75,
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

  useEffect(() => {
    if (map) {
      gotoAddress(addresses[0])
    }
  }, [map])

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

  function setInfoWindow(streetNum) {
    console.log({address: streetNum})
    let propertyDetail = propertyDetails.find((detail) => detail["Location Address"].includes(streetNum));
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
    return infowindow;
  }

  useEffect(() => {
    if (!map || !infoContent) return;

    const { address, position } = infoContent;
    if (activeInfoWindow) {
      activeInfoWindow.close();
    }
    const infowindow = setInfoWindow(address);
    setActiveInfoWindow(infowindow)
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

  function goToNext() {
    gotoAddress(addresses[propertyIndex + 1])
    setPropertyIndex((propertyIndex + 1) % addresses.length)
  }
  function goToPrev() {
    gotoAddress(addresses[Math.floor(propertyIndex - 1, 0)])
    setPropertyIndex((Math.floor(propertyIndex - 1, 0)) % addresses.length)
  }

  return (
    <>
      <header style={{display: 'flex', flexDirection: 'row', height: '5vh', width: '100vw', zIndex: 99, position: 'fixed', top: 0}}>
        <button style={{width: '50%'}} onClick={goToPrev}>Prev</button>
        <button style={{width: '50%'}} onClick={goToNext}>Next</button>
      </header>
      <div style={{ height: '90vh', width: '100vw', marginTop: '4vh' }} ref={ref} id="map" />
      <p>Click property shape to view details</p>
    </>
  );
}

export default App;
