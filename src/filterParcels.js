const fs = require('fs');
const parcels = require('./Parcel (1).json');

const allowedAddresses = [
  '3061 FIELDSTONE WAY',
  '3001 LAKECREST CIR',
  '1842 AUGUSTA DR',
  '1807 AUGUSTA CT',
  '1633 RALEIGH RD',
  '1874 AUGUSTA DR',
  '1890 AUGUSTA DR',
  '1804 1812 AUGUSTA CT',
  '1804 AUGUSTA CT',
  '1812 AUGUSTA CT',
  '1644 RALEIGH RD',
  '1836 AUGUSTA DR',
  '1828 AUGUSTA DR',
  '1831 1843 AUGUSTA DR',
  '1843 AUGUSTA DR',
  '1831 AUGUSTA DR',
  '1800 AUGUSTA CT'
]

const features = parcels.features.filter((feature, i) => {
  console.log(`${i} / ${parcels.features.length} (${i/parcels.features.length}%)`);
  let address = feature.properties.ADDRESS;
  return allowedAddresses.includes(address);
})

fs.writeFileSync("./parcels.geojson", JSON.stringify({
  ...parcels,
  features
}));
