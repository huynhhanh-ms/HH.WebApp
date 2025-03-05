/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Land } from 'src/domains/dto/land';

import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRef, useState, useEffect, useCallback } from "react";

import { Box, Grid, Button, Switch, Typography, IconButton, ToggleButton } from "@mui/material";

import { fNumber } from 'src/utils/format-number';

import { useLand } from 'src/stores/use-land';
import { LandApi } from 'src/services/api/land.api';
import { ApiQueryKey } from 'src/services/api-query-key';
import { LandType, isCoordinates } from 'src/domains/dto/land';

import ListLand from '../components/ListLand';
import LandCreateModel from '../components/land-create-model';
import { MapUtil, LayerType, HtmlAreaInfo, getOrCreateLayer } from '../maptalks/map-util';

export function LandView() {
  const map = useRef<maptalks.Map | null>(null);
  const selectedObject = useRef<maptalks.Polygon | maptalks.Marker | maptalks.LineString | null>(null);

  //* API Query
  const { data: landData, isSuccess: landSuccess } = useQuery({
    queryKey: [ApiQueryKey.land],
    queryFn: LandApi.gets,
  });

  const { mutateAsync: getBound, data: boundData, isSuccess: boundSuccess } = useMutation({
    mutationFn: LandApi.getBound,
    mutationKey: [],
  });



  //* Create UseState
  const [clickPoint, setClickPoint] = useState({ x: 0, y: 0 });
  const [isGetBound, setIsGetBound] = useState(false);
  const {
    selectedLand, points, addPoints, resetPoints,
    isEditing, setIsEditing,
    isCreateLand, setIsCreateLand,
  } = useLand();

  //* Handle Event
  const onGetBound = useCallback((e: any) => {
    getBound({ lng: e.coordinate.x, lat: e.coordinate.y });
  }, [getBound]);

  useEffect(() => {
    if (!map.current) return;

    if (isGetBound) {
      map.current.on("click", onGetBound);
    } else {
      map.current.off("click", onGetBound);
    }

  }, [isGetBound, onGetBound]);


  //* Use Effect MapStalk
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

    map.current.on('click', (e) => { if (!e) return; const { x, y } = e.coordinate; setClickPoint({ x, y }); });

    MapUtil.addLayers(map.current, [
      LayerType.Bound,
      LayerType.Land,
    ]);

    const vectorLayer = MapUtil.getOrCreateLayer(map.current, LayerType.Text);
    const cayXangTitle = new maptalks.Marker([108.43315288424492, 12.67051153268791], {
      symbol: { textName: 'Cây xăng ⛽', textFill: '#004497', textSize: 10, }
    }).addTo(vectorLayer);
    const houseTitle = new maptalks.Marker([108.43293961917387, 12.670161455074362], {
      symbol: { textName: 'Nhà🛖', textFill: '#181818', textSize: 10, }
    }).addTo(vectorLayer);

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

    threeLayer.prepareToDraw = (gl, scene, camera) => {
      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, -10, 10).normalize();
      scene.add(light);
      scene.add(new THREE.AmbientLight('#fff', 0.5));
      addPolygon();
    };

    threeLayer.addTo(map.current);
    return () => { map.current?.remove(); };
  }, []);

  useEffect(() => {
    if (landData && map.current && map) {
      console.log('update landData to map', landData);
      MapUtil.clearLayer(map.current, LayerType.Land);
      landData.forEach((land) => {
        if (!isCoordinates(land.location.coordinates)) return;
        MapUtil.addPolygon(map.current!, LayerType.Land, land.location.coordinates, land.type);
      });
    };
  }, [landData, map]);

  // useEffect(() => {
  //   if (map.current && landData && selectedLand !== null) {
  //     const land: Land = landData[selectedLand];
  //     const centroid = MapUtil.getPolygonCentroid(land.location.coordinates);
  //     if (!centroid) return;

  //     map.current.animateTo( { center: centroid, zoom: 19, pitch: 60, }, { duration: 2000, });

  //     MapUtil.addPolygon(map.current, LayerType.Create, landData[selectedLand].location.coordinates, land.type, true);
  //   }
  // }, [landData, selectedLand]);

  const onMoveToLand = (id) => {
    console.log('selected land');
    if (map.current && landData) {
      const land: Land = landData[id];
      const centroid = MapUtil.getPolygonCentroid(land.location.coordinates);
      if (!centroid) return;

      map.current.animateTo({ center: centroid, zoom: 19, pitch: 60, }, { duration: 2000, });

      // MapUtil.addPolygon(map.current, LayerType.Create, landData[id].location.coordinates, land.type, true);

      // show information land here

      // Lấy vị trí label (dời lên trên 1 chút so với trọng tâm)
      const labelPosition = [centroid[0] + 0.0001, centroid[1] + 0.0002];

      // Tạo Marker để đánh dấu vị trí thông tin
      const marker = new maptalks.Marker(centroid, {
        symbol: {
          textFaceName: 'sans-serif',
          textName: '●', // Dấu tròn
          textFill: '#000',
          textSize: 16,
        },
      });

      // Tạo đường nối từ marker đến label
      const line = new maptalks.LineString([centroid, labelPosition], {
        symbol: {
          lineColor: '#000',
          lineWidth: 2,
        },
      });

      // Hiển thị thông tin bằng Label
      const label = new maptalks.Label(land.name, labelPosition, {
          'draggable' : true,
          'textSymbol': {
            'textFaceName' : 'monospace',
            'textFill' : '#34495e',
            'textHaloFill' : '#fff',
            'textHaloRadius' : 4,
            'textSize' : 18,
            'textWeight' : 'bold',
            'textVerticalAlignment' : 'top'
          }
        });

      // Thêm vào layer riêng
      const infoLayer = MapUtil.getOrCreateLayer(map.current, LayerType.Info);
      infoLayer.clear();
      infoLayer.addGeometry([marker, line, label]);
    }
  };


  const onClickCreateLand = useCallback((e) => {
    const { x, y } = e.coordinate;
    addPoints([{ x, y }]);
  }, [addPoints]);

  //* Draw New Land
  useEffect(() => {
    if (!map.current) return;
    if (points.length < 2) {
      MapUtil.clearLayer(map.current, LayerType.Create);

    }

    MapUtil.clearLayer(map.current, LayerType.Create);
    selectedObject.current = MapUtil.addPolygon(map.current, LayerType.Create, [points.map((p) => [p.x, p.y])], LandType.NewLand);
  }, [points]);

  // Bật chỉnh sửa
  const enableEditing = useCallback(() => {
    if (!selectedObject.current) return;
    selectedObject.current.startEdit();

    // selectedObject.current.on("shapechange", () => {
    //   const newCoords = selectedObject.current?.getCoordinates()[0].map((coord: any) => {
    //     const [lng, lat] = coord as [number, number];
    //     return { x: lng, y: lat };
    //   });
    //   addPoints(newCoords || []);
    // });
  }, []);


  // Tắt chỉnh sửa
  const disableEditing = useCallback(() => {
    selectedObject.current?.endEdit();
  }, []);

  useEffect(() => {
    if (isEditing) {
      enableEditing();
    } else {
      disableEditing();
    }
  }, [isEditing, enableEditing, disableEditing]);



  useEffect(() => {
    if (!isCreateLand) {
      map.current?.off('click', onClickCreateLand);
    }
    if (map.current && isCreateLand) {
      map.current.on('click', onClickCreateLand);
      MapUtil.clearLayer(map.current, LayerType.Create);
      resetPoints();
    }
  }, [isCreateLand, onClickCreateLand, resetPoints]);

  return (
    <div>
      <Grid container>
        {/* MAPTALKS */}
        <Grid item xs={12} md={9} sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)" }}>
          <div id="map" style={{ width: "100%", height: "calc(100vh - 120px)" }} />
        </Grid>
        {/* right bar */}
        <Grid item xs={12} md={3} sx={{ borderRight: "2px solid rgba(146, 146, 146, 0.12)", padding: 4 }} >
          <Switch onChange={(e) => { setIsGetBound(e.target.checked) }} />
          <Typography fontWeight="bold" display="inline">Get Bound</Typography>
          <Button>[{fNumber(clickPoint.x, { maximumFractionDigits: 4 } as any)}, {fNumber(clickPoint.y, { maximumFractionDigits: 4 } as any)}]</Button>

          <div className='p-4'>
            <HtmlAreaInfo html={boundData?.html ?? ""} />
          </div>

          {/* function button */}
          <Button onClick={() => setIsCreateLand(!isCreateLand)} variant='contained' color={isCreateLand ? 'error' : 'primary'}>
            {isCreateLand ? 'Hủy tạo vùng đất' : 'Tạo vùng đất'}
          </Button>
          <Button onClick={() => setIsEditing()} variant='contained' color={isEditing ? 'error' : 'primary'}>
            <Typography fontWeight="bold">Sửa</Typography>
          </Button>

          <LandCreateModel />

          {/* Land List */}
          <Typography align='center' fontWeight="bold" paddingTop={4}>Danh sách vùng đất</Typography>
          <div className='h-10'>
            <ListLand data={landData ?? []} onClick={onMoveToLand} />
          </div>

        </Grid>

      </Grid>

    </div>
  );
}