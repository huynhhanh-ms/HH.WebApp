import * as THREE from 'three';
import * as turf from '@turf/turf';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import { useState, useEffect } from "react";

import { Button } from "@mui/material";

import HereMapDrawArea from "../area/map/HereMapDrawArea";

export function LandView() {

  const [reset, setReset] = useState(false);
  const [waterLevel, setWaterLevel] = useState(1); // Mực nước ban đầu là 1m

  useEffect(() => {
    // init
    const vietnamExtent = new maptalks.Extent(102.144, 8.551, 109.466, 23.388); // xMin, yMin, xMax, yMax
    const map = new maptalks.Map('map', {
      center: [106.7009, 10.7769], // Toạ độ (long, lat)
      zoom: 17,
      pitch: 60,
      // baseLayer: new maptalks.TileLayer('base', {
      //   urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      // })
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ["a", "b", "c", "d"],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
      }),
      maxExtent: vietnamExtent,
    });

    // Lớp vector để vẽ các đối tượng
    const vectorLayer = new maptalks.VectorLayer('vector').addTo(map);

    // Thêm một vùng đất (ruộng) bằng Polygon
    const ruong = new maptalks.Polygon([
      [[106.701, 10.777], [106.702, 10.776], [106.7015, 10.775], [106.701, 10.777]]
    ], {
      symbol: {
        lineColor: '#1a1a1a',
        lineWidth: 2,
        polygonFill: '#777777',
        polygonOpacity: 0.4
      }
    }).addTo(vectorLayer);

    // Thêm một điểm đánh dấu vị trí ống xả nước
    const marker = new maptalks.Marker([106.7015, 10.7765], {
      symbol: {
        textName: '🚰 Cống xả',
        textFill: '#2386ff',
        textSize: 14
      }
    }).addTo(vectorLayer);



    // Lớp mô phỏng nước
    const waterLayer = new maptalks.VectorLayer('water').addTo(map);
    const waterPolygon = new maptalks.Polygon([
      [106.7005, 10.7765],
      [106.7010, 10.7765],
      [106.7010, 10.7770],
      [106.7005, 10.7770]
    ], {
      symbol: {
        polygonFill: 'blue',
        polygonOpacity: 0.5
      }
    }).addTo(waterLayer);

    // Hàm cập nhật mức nước
    const updateWaterLevel = (level) => {
      setWaterLevel(level); // Cập nhật state React
      waterPolygon.setSymbol({
        polygonFill: 'blue',
        polygonOpacity: level * 0.1 // Đổi độ trong suốt theo mức nước
      });
    };

    // Gọi update sau 3 giây
    setTimeout(() => updateWaterLevel(10), 10000);



    const material = new THREE.MeshLambertMaterial({ color: '#fff', transparent: true });
    const material1 = new THREE.MeshLambertMaterial({ color: '#fff', transparent: true, opacity: 0.01 });
    const highlightmaterial = new THREE.MeshLambertMaterial({ color: 'red', transparent: true, opacity: 0.7 });


    const threeLayer = new ThreeLayer('three', {}).addTo(map);
    // Tạo hình hộp (Tòa nhà)
    // const createBuilding = (lng, lat, height) => {
    //   const geometry = new THREE.BoxGeometry(30, 30, height); // Hộp 3D
    //   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
    //   const mesh = new THREE.Mesh(geometry, material);

    //   // Chuyển đổi tọa độ địa lý thành vị trí 3D trên bản đồ
    //   const center = map.coordinateToPoint(new maptalks.Coordinate(lng, lat));
    //   mesh.position.set(center.x, center.y, height / 2); // Đặt chiều cao

    //   return mesh;
    // };

    // // Thêm tòa nhà vào bản đồ
    // const building = createBuilding(106.7009, 10.7769, 100); // Tòa nhà cao 100m
    // threeLayer.addMesh(building);


    function addPolygon(): void {
      const extrudePolygons: any[] = [];

      // Xác định đối tượng GeoJSON cho polygon đầu tiên (tòa nhà chính)
      const polygonFeature1: GeoJSON.Feature<GeoJSON.Polygon> = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [106.7005, 10.7765],
              [106.7010, 10.7765],
              [106.7010, 10.7770],
              [106.7005, 10.7770],
              [106.7005, 10.7765],

            ]
          ]
        },
        properties: {
          fill: 'red',
          name: "1-3cf0006e",
        }
      };

      // Tạo hình extrude cho building đầu tiên với chiều cao 60
      const building1 = threeLayer.toExtrudePolygon(polygonFeature1, { height: 60, topColor: 'red' }, material);
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

    threeLayer.addTo(map);


    const canalLayer = new maptalks.VectorLayer('canalLayer').addTo(map);

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
        map.setCenter(new maptalks.Coordinate(lng, lat));
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
    // navigator.geolocation.clearWatch(watchId);

    return () => { map.remove(); }; // Cleanup khi component bị unmount
  }, []);



  return (
    <div>
      {/* <HereMapDrawArea onAreaChange={(points) => { setValue("boundaries", points) }} /> */}
      {/* <HereMapDrawArea onAreaChange={(points) => {console.log("onAreaChange")}} reset={reset} afterReset={() => setReset(false)} /> */}
      {/* <Button onClick={() => {setReset(true)}}>Reset</Button> */}
      <div id="map" style={{ width: "100%", height: "500px" }} />
      123


    </div>
  );
}