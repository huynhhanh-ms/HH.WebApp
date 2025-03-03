import * as THREE from 'three';
import * as turf from '@turf/turf';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import { useRef, useState, useEffect } from "react";

import { Grid, Button, Switch, Typography, ToggleButton } from "@mui/material";


export function LandViewExample() {

  const map = useRef<maptalks.Map | null>(null);

  const [reset, setReset] = useState(false);
  const [clickPoint, setClickPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // init
    const vietnamExtent = new maptalks.Extent(102.144, 8.551, 109.466, 23.388); // xMin, yMin, xMax, yMax
    map.current = new maptalks.Map('map', {
      center: [108.433204, 12.670464], zoom: 19, pitch: 60,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ["a", "b", "c", "d"],
      }),
      maxExtent: vietnamExtent,
    });


    // Lắng nghe sự kiện click
    map.current.on('click', (e) => {
      if (e && e.coordinate) {
        const { x, y } = e.coordinate; // Lấy tọa độ (longitude, latitude)
        setClickPoint({ x, y });
      }
    });

    // Lớp vector để vẽ các đối tượng
    const vectorLayer = new maptalks.VectorLayer('vector').addTo(map.current);

    // Thêm một vùng đất (ruộng) bằng Polygon
    const datChinh = new maptalks.Polygon([
      [108.43346199, 12.67077899], [108.43309701, 12.66995498], [108.43271102, 12.67018299], [108.43232002, 12.670393], [108.43143199, 12.67087196], [108.43138198, 12.671308], [108.43130497, 12.67137298], [108.432015, 12.67257003], [108.432901, 12.67173901], [108.43285011, 12.67165094], [108.43278197, 12.67153303], [108.4327082, 12.67140681], [108.43253999, 12.67111897], [108.43262999, 12.67105797], [108.43290799, 12.67086103], [108.43301798, 12.67102895], [108.43346199, 12.67077899]
    ], {
      symbol: {
        lineColor: '#1a1a1a',
        lineWidth: 2,
        polygonFill: '#777777',
        polygonOpacity: 0.4
      }
    }).addTo(vectorLayer);

    const cayXang = new maptalks.Polygon([
      [108.43325346708299, 12.670566487386456], [108.43314081430438, 12.6706240589627], [108.43313042074442, 12.670602469623137], [108.4329701587558, 12.670673452747865], [108.43293428421022, 12.670619152294785], [108.43289338052274, 12.670551767379072], [108.4330663830042, 12.670470970878986], [108.433055318892, 12.67044316640948], [108.433055318892, 12.67044316640948], [108.43317132443191, 12.670390828576277]
    ], {
      symbol: {
        lineColor: '#004497',
        lineWidth: 2,
        polygonFill: '#004497',
        polygonOpacity: 0.4
      }
    }
    ).addTo(vectorLayer);

    const cayXangTitle = new maptalks.Marker([108.43315288424492, 12.67051153268791], {
      symbol: {
        textName: 'Cây xăng ⛽', textFill: '#004497', textSize: 10,
      }
    }).addTo(vectorLayer);
    const houseTitle = new maptalks.Marker([108.43293961917387, 12.670161455074362], {
      symbol: {
        textName: 'Nhà🛖', textFill: '#181818', textSize: 10,
      }
    }).addTo(vectorLayer);

    const waterLayer = new maptalks.VectorLayer('water').addTo(map.current);
    const waterPolygon = new maptalks.Polygon([
      [108.43340226654179, 12.670815309014694], [108.43301858055986, 12.671030710861022], [108.4329086685199, 12.670862045086182], [108.43332521499688, 12.670637788892583]
    ], {
      symbol: {
        polygonFill: 'green',
        polygonOpacity: 0.05
      }
    }).addTo(waterLayer);

    const house = new maptalks.Polygon(
      [[108.43277771025897, 12.670308723578795], [108.43294803053143, 12.670223674549522], [108.43289103358984, 12.670124886795266], [108.4327180311084, 12.670212225639565]]
    ).addTo(waterLayer);

    // Hàm cập nhật mức nước
    const updateWaterLevel = (level) => {
      waterPolygon.setSymbol({
        polygonFill: 'green',
        polygonOpacity: level * 0.1 // Đổi độ trong suốt theo mức nước
      });
    };
    for (let i = 1; i <= 5; i += 1) {
      setTimeout(() => updateWaterLevel(i), i * 500);
    }
    const material = new THREE.MeshLambertMaterial({ color: '#fff', transparent: true });
    const material1 = new THREE.MeshLambertMaterial({ color: '#fff', transparent: true, opacity: 0.01 });
    const highlightmaterial = new THREE.MeshLambertMaterial({ color: 'red', transparent: true, opacity: 0.7 });

    const threeLayer = new ThreeLayer('three', {}).addTo(map.current);

    function addPolygon(): void {
      const extrudePolygons: any[] = [];

      // Xác định đối tượng GeoJSON cho polygon đầu tiên (tòa nhà chính)
      const polygonFeature1: GeoJSON.Feature<GeoJSON.Polygon> = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [[108.43277771025897, 12.670308723578795], [108.43294803053143, 12.670223674549522], [108.43289103358984, 12.670124886795266], [108.4327180311084, 12.670212225639565]]
          ]
        },
        properties: {
          fill: 'red',
          name: "1-3cf0006e",
        }
      };

      // Tạo hình extrude cho building đầu tiên với chiều cao 60
      const building1 = threeLayer.toExtrudePolygon(polygonFeature1, { height: 5, topColor: 'red', bottomColor: 'red' }, material);
      extrudePolygons.push(building1);
      threeLayer.addMesh(extrudePolygons);
    }


    threeLayer.prepareToDraw = function (gl, scene, camera) {
      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, -10, 10).normalize();
      scene.add(light);
      scene.add(new THREE.AmbientLight('#fff', 0.5));
      addPolygon();

    };

    threeLayer.addTo(map.current);


    const canalLayer = new maptalks.VectorLayer('canalLayer').addTo(map.current);

    const canal = new maptalks.LineString([
      [106.7005, 10.777], [106.7015, 10.776], [106.7025, 10.775]
    ], {
      symbol: {
        lineColor: '#00f',
        lineWidth: 3
      }
    }).addTo(canalLayer);


    // Tạo marker ban đầu (có thể đặt vị trí tạm thời)
    const currentMarker = new maptalks.Marker([107.6, 16.2], {
      symbol: {
        markerFile: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
        markerWidth: 32,
        markerHeight: 32
      }
    }).addTo(canalLayer);

    // Theo dõi vị trí liên tục
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        // Cập nhật center của bản đồ
        map.current?.setCenter(new maptalks.Coordinate(lng, lat));
        // Cập nhật vị trí của marker
        currentMarker.setCoordinates([lng, lat]);
      },
      (error) => {
        console.error('Lỗi khi theo dõi vị trí: ', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
    console.log(watchId);

    // Nếu cần dừng theo dõi, bạn có thể gọi:

    navigator.geolocation.clearWatch(watchId);

    return () => { map.current?.remove(); }; // Cleanup khi component bị unmount
  }, []);



  return (
    <div>
      {/* <HereMapDrawArea onAreaChange={(points) => { setValue("boundaries", points) }} /> */}
      {/* <HereMapDrawArea onAreaChange={(points) => {console.log("onAreaChange")}} reset={reset} afterReset={() => setReset(false)} /> */}
      {/* <Button onClick={() => {setReset(true)}}>Reset</Button> */}
      <div id="map" style={{ width: "100%", height: "calc(100vh - 120px)" }} />
      <div style={{ borderRadius: '25px', display: 'flex', position: "fixed", bottom: 0, left: 0, right: 0, padding: 10, margin: 10, width: '50%', backgroundColor: "#e4e4e4", transform: "translateX(50%)" }}>
        <Switch onChange={(e) => { }} icon={<Typography>🥲</Typography>} checkedIcon={<Typography>😎</Typography>} />
        <Typography align='center'>Click point: [{clickPoint.x}, {clickPoint.y}]</Typography>
      </div>
    </div>
  );
}