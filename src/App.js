import { Wrapper } from "@googlemaps/react-wrapper";

import './App.css';
import {useEffect, useRef, useState} from "react";
const data = require('./coords.json')



function App() {
  return (
    <Wrapper apiKey={"AIzaSyDJ9421MXFa_SDtRbnmrWJd_34Xg5cmgrM"}>
      <MyMapComponent center={{lng: -84.4976, lat: 38.05747}} zoom={14} />
    </Wrapper>
  );
}

function MyMapComponent({ center, zoom }) {
  const ref = useRef();
  const [map, setMap] = useState(null)
  useEffect(() => {
    const newMap = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    })
    newMap.data.loadGeoJson('/york.geojson')
    newMap.data.setStyle({
      fillColor: 'green',
      strokeWeight: 1
    })
    setMap(newMap);
  }, [center, zoom]);

  const getColor = grade => {
    switch(grade) {
      case 'A':
        return 'green'
      case 'B':
        return 'blue'
      case 'C':
        return 'yellow'
      case 'D':
        return 'red'
    }
  }

  // useEffect(() => {
  //   data.map((dataPoint) => {
  //     const color = getColor(dataPoint.grade)
  //     var myPolygon = new window.google.maps.Polygon({
  //       paths: dataPoint.coords.map((pair) => ({ lng: pair[0], lat: pair[1]})),
  //       strokeColor: color,
  //       strokeOpacity: 0.8,
  //       strokeWeight: 2,
  //       fillColor: color,
  //       fillOpacity: 0.35
  //     });
  //     myPolygon.setMap(map);
  //   })
  // }, [map])

  return <div style={{height: '100vh', width: '100vw'}} ref={ref} id="map"/>;
}

export default App;


