import './App.css';
import {useEffect, useRef, useState} from "react";
import { Wrapper, } from "@googlemaps/react-wrapper";
const data = require('./coords.json')
const cameras = require('./cameras.json')
const precincts = require('./race.json')
const crimes = require('./crimes.json')
var tinycolor = require("tinycolor2");





function App() {
  return (
    <Wrapper libraries={['visualization']} apiKey={"AIzaSyDJ9421MXFa_SDtRbnmrWJd_34Xg5cmgrM"}>
      <MyMapComponent center={{lng: -84.50, lat: 38.041}} zoom={14} />
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
  //   newMap.data.loadGeoJson('/york.geojson')
  //   newMap.data.setStyle(function(feature) {
  //     const streetNumber = feature.getProperty('NUM1');
  //     let color;
  //     switch (streetNumber) {
  //       case '114':
  //       case '104':
  //       case '106':
  //       case '108':
  //       case '110':
  //       case '112':
  //         color = 'red'; //marty clifford april 2013 buy
  //         break;
  //       default:
  //         color = 'blue'
  //     }
  //     console.log(streetNumber, color)
  //     return {
  //       fillColor: color,
  //       strokeWeight: 1
  //     };
  //   })
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

  useEffect(() => {
    // data.map((dataPoint) => {
    //   const color = getColor(dataPoint.grade)
    //   var myPolygon = new window.google.maps.Polygon({
    //     paths: dataPoint.coords.map((pair) => ({ lng: pair[0], lat: pair[1]})),
    //     strokeColor: color,
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: color,
    //     fillOpacity: 0.35
    //   });
    //   myPolygon.setMap(map);
    // })
    cameras.map(({lat, lng}) => {
      const myCamera = new window.google.maps.Marker({
        position: {lat, lng},
        map,
        title: "Flock License Plate Reader",
      });
    })
    const raceData = precincts.reduce((acc, precinct) => {
      let totalNonWhite = precinct.properties["P0010001"] - precinct.properties["P0010003"];
      const result = {
        name: precinct.properties.NAME,
        percentNonWhite: totalNonWhite / precinct.properties["P0010001"],
        coords: precinct.geometry.coordinates[0]
      }
      return [
        ...acc,
        result
      ]
    }, [])
    raceData.map((dataPoint) => {
      // const color = `rgba(0,0,0,${dataPoint.percentNonWhite}`;
      const color = tinycolor("white").darken((dataPoint.percentNonWhite) * 100).toHexString();
      console.log({ color, percentNonWhite: dataPoint.percentNonWhite})

      var myPolygon = new window.google.maps.Polygon({
        paths: dataPoint.coords.map((pair) => ({ lng: pair[0], lat: pair[1]})),
        strokeColor: 'black',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: .75,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        // position: { lng: dataPoint.coords[0][0], lat: dataPoint.coords[0][1]},
        content: `${dataPoint.name}: ${dataPoint.percentNonWhite * 100}% non-white`,
      });

      myPolygon.addListener("click", (event) => {
        console.log({event})
        infoWindow.setPosition(event.latLng)
        infoWindow.open(map, myPolygon);
      });

      // myPolygon.setMap(map);
    })

    const crimeCoords = crimes.map((crime) => ({
      location: new window.google.maps.LatLng(crime["YCoordinate"], crime["XCoordinate"]),
      weight: 1,
    }));
    console.log(crimeCoords[0].location.lat())
    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: crimeCoords,
      map,
      radius: 50,
      zIndex: 99,
      dissipating: true,
      maxIntensity: 7
    });
    heatmap.setMap(map);

  }, [map])

  return <div style={{height: '100vh', width: '100vw'}} ref={ref} id="map"/>;
}

export default App;


