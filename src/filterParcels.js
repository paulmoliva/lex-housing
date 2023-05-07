const fs = require('fs');
const parcels = require('./Parcel (1).json');

const allowedAddresses = [
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

const features = parcels.features.filter((feature, i) => {
  console.log(`${i} / ${parcels.features.length} (${i/parcels.features.length}%)`);
  let address = feature.properties.ADDRESS;
  return allowedAddresses.includes(address);
})

fs.writeFileSync("./parcels.geojson", JSON.stringify({
  ...parcels,
  features
}));
