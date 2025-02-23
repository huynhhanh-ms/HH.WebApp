import React, { useEffect } from "react";
import { Geography, Geographies, ComposableMap } from "react-simple-maps";

const geoUrl = "assets/marketing/vietnam.json";

const ColoredProvince = ["Đắk Lắk", "Đăk Nông", "Gia Lai", "Phú Yên"];

const MapChart = () => (
    <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1000, center: [108, 16] }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={ColoredProvince.includes(geo.properties.name) ? "#FF5733" : "#D6D6DA"}
              stroke="#FFFFFF"
              style={{
                default: { outline: "none" },
                hover: { fill: "#F53", outline: "none" },
                pressed: { fill: "#E42", outline: "none" },
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );

export default MapChart;
