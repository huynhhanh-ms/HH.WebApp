/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRef, useState, useEffect, useCallback } from "react";

import { Box, Grid, Button, Switch, Typography, ToggleButton } from "@mui/material";

import { fNumber } from 'src/utils/format-number';

import { useLand } from 'src/stores/use-land';
import { LandApi } from 'src/services/api/land.api';
import { ApiQueryKey } from 'src/services/api-query-key';
import { LandType, LandObjectType, type MergedType } from 'src/domains/dto/land';

import ListLand from '../components/ListLand';
import { MapUtil, LayerType, HtmlAreaInfo, getOrCreateLayer } from '../maptalks/map-util';

export function LandView() {
  const map = useRef<maptalks.Map | null>(null);

  const { data: landData, isSuccess: landSuccess } = useQuery({
    queryKey: [ApiQueryKey.land],
    queryFn: LandApi.gets,
  });

  const { mutateAsync: getBound, data: boundData, isSuccess: boundSuccess } = useMutation({
    mutationFn: LandApi.getBound,
    mutationKey: [],
  });

  const [clickPoint, setClickPoint] = useState({ x: 0, y: 0 });
  const [isGetBound, setIsGetBound] = useState(false);
  const { selectedLand } = useLand();

  const handleClick = useCallback(async (x: number, y: number) => {
    if (isGetBound) {
      getBound({ lng: x, lat: y });
    }
    setClickPoint({ x, y });
  }, [getBound, isGetBound]);

  useEffect(() => {
    if (map.current && boundData && boundData.location) {
      MapUtil.addPolygon(map.current!, "bound-layer", boundData.location.coordinates, LandType.Default);
    }
  }, [boundData]);


  useEffect(() => {
    const vietnamExtent = new maptalks.Extent(102.144, 8.551, 109.466, 23.388); // xMin, yMin, xMax, yMax
    map.current = new maptalks.Map('map', {
      center: [108.433204, 12.670464], zoom: 19, pitch: 60,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: MapUtil.googleMapLayer,
        subdomains: ["a", "b", "c", "d"],
      }),
      maxExtent: vietnamExtent,
    });

    map.current.on('click', (e) => { if (!e) return; const { x, y } = e.coordinate; handleClick(x, y); });

    MapUtil.addLayers(map.current, [
      LayerType.Bound,
      LayerType.Land,
    ]);

    const vectorLayer = new maptalks.VectorLayer('vector').addTo(map.current);
    const cayXangTitle = new maptalks.Marker([108.43315288424492, 12.67051153268791], {
      symbol: { textName: 'Cây xăng ⛽', textFill: '#004497', textSize: 10, }
    }).addTo(vectorLayer);
    const houseTitle = new maptalks.Marker([108.43293961917387, 12.670161455074362], {
      symbol: { textName: 'Nhà🛖', textFill: '#181818', textSize: 10, }
    }).addTo(vectorLayer);

    const waterLayer = new maptalks.VectorLayer('water').addTo(map.current);
    const house = new maptalks.Polygon(
      [[108.43277771025897, 12.670308723578795], [108.43294803053143, 12.670223674549522], [108.43289103358984, 12.670124886795266], [108.4327180311084, 12.670212225639565]]
    ).addTo(waterLayer);

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
    return () => { map.current?.remove(); };
  }, [handleClick]);

  useEffect(() => {
    if (landSuccess && map.current && map) {
      landData.forEach((land) => {
        MapUtil.addPolygon(map.current!, "land-layer", land.location.coordinates, LandType.Default);
      });
    };
  }, [landData, landSuccess, map, handleClick]);

  useEffect(() => {
    if (map.current && landData && selectedLand !== null) {
      map.current.animateTo(
        {
          center: landData[selectedLand].location.coordinates[0][0],
          zoom: 19, pitch: 60,
        },
        {
          duration: 2000,
        }
      );

      // console.log(selectedLand);
      MapUtil.addPolygon(map.current, "bound-layer", landData[selectedLand].location.coordinates, LandType.Farm);
    }
  }, [landData, selectedLand]);

  return (
    <div>
      <Grid container>
        {/* MAPTALKS */}
        <Grid item xs={12} md={9} sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)" }}>
          <div id="map" style={{ width: "100%", height: "calc(100vh - 120px)" }} />
        </Grid>
        {/* right bar */}
        <Grid item xs={12} md={3} sx={{ borderRight: "2px solid rgba(146, 146, 146, 0.12)", padding: 2 }} >
          <Switch onChange={(e) => { setIsGetBound(e.target.checked) }} /> lấy vùng đất
          <Typography align='center'>Vị trí bấm [{fNumber(clickPoint.x, { maximumFractionDigits: 4 } as any)}, {fNumber(clickPoint.y, { maximumFractionDigits: 4 } as any)}]</Typography>
          <div className='p-4'>
            <HtmlAreaInfo html={boundData?.html ?? ""} />
          </div>
          <Typography align='center' fontWeight="bold">Danh sách vùng đất</Typography>
          <div className='h-10'>
            <ListLand data={landData ?? []} />
          </div>

        </Grid>

      </Grid>

    </div>
  );
}