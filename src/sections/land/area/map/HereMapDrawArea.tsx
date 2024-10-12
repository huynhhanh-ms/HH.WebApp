import H from "@here/maps-api-for-javascript";
import { useRef, useState, useEffect } from "react";

import type { AreaAdmin } from "../entity/area";

type Props = {
  apikey?: string;
  area?: AreaAdmin;
  onAreaChange?: (points: {lat:number, lng:number}[]) => void
};
const HereMapDrawArea = (props: Props) => {
  const [boundary, setBoundary] = useState<{ lat: number; lng: number }[]>([]);
  const [polygon, setPolygon] = useState<H.map.Polygon | null>(null);
  // const theme = useTheme();
  const mapRef = useRef(null);
  const map = useRef<H.Map | null>(null);
  const platform = useRef<H.service.Platform | null>(null);
  const { apikey = "7h1jyg35V5JfNIgPA8m1XEN39K9giRbtrfNj8nJ5kd4" , onAreaChange} =
    props;
  
  useEffect(() => {
    if (boundary.length > 1) {
      const linePoints = boundary?.reduce<number[]>(
        (prev, cur) => [...prev, cur?.lat, cur?.lng, 100],
        []
      );
      linePoints.push(boundary[0]?.lat);
      linePoints.push(boundary[0]?.lng);
      linePoints.push(100);
      const lineString = new H.geo.LineString(linePoints);
      const newPolygon = new H.map.Polygon(lineString, {
        style: {
          fillColor: "rgba(230, 244, 255, 0.7)",
          strokeColor: "#829",
          lineWidth: 1,
        },
        data: [],
      });
      const redDotIcon = new H.map.Icon('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="red" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5"/></svg>');
      // Create markers at the coordinates of each point
        const markers:any = [];
        boundary.map((point) => {
            const marker = new H.map.Marker(point);
            marker.setIcon(redDotIcon);
            marker.draggable = true;
        return marker;
      });
      boundary.forEach((point) => {
        const marker = new H.map.Marker(point);
            marker.setIcon(redDotIcon);
            marker.draggable = true;
        markers.push(marker);
      });
  
      // Clear the previous markers
      if (map.current) {
        map.current.removeObjects(map.current.getObjects());
      }
  
      // Add the polygon and markers to the map
      if (map.current) {
        map.current.addObjects([newPolygon, ...markers]);
      }
  
      // Set the polygon and markers in state
      setPolygon(newPolygon);
    }
    onAreaChange?.(boundary);
  }, [boundary,onAreaChange]);
  useEffect(()=>{
    if(!!map.current && !!polygon){
        map.current.addObject(polygon)
    }
  },[polygon])
  const handleAddBoundary = (newPoint: { lat: number; lng: number }) => {
    setBoundary((prevBoundary) => [...prevBoundary, newPoint]);
  };
  useEffect(
    () => {
      // Check if the map object has already been created
      if (!map.current) {
        // Create a platform object with the API key
        platform.current = new H.service.Platform({ apikey });
        // Create a new Raster Tile service instance
        const rasterTileService = platform.current.getRasterTileService({
          queryParams: {
            style: "explore.day",
            size: 1024,
          },
        });

        const rasterTileProvider = new H.service.rasterTile.Provider(
          rasterTileService
        );

        const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);
        if (mapRef.current) {
          const newMap = new H.Map(mapRef.current, rasterTileLayer, {
            pixelRatio: window.devicePixelRatio,
            center: {
              lat: 10.871592515732114,
              lng: 106.79497720296311,
            },
            zoom: 14,
          });
        // Add panning and zooming behavior to the map
        // eslint-disable-next-line no-new
        new H.mapevents.Behavior(
          new H.mapevents.MapEvents(newMap)
        );

        newMap.addEventListener("tap", (evt: { currentPointer: { viewportX: number; viewportY: number; }; }) => {
          const point = newMap.screenToGeo(
            evt.currentPointer.viewportX,
            evt.currentPointer.viewportY
          );
          if (point) {
            const { lat, lng } = point;
            handleAddBoundary({ lat, lng });
            console.log(`Clicked at: Latitude ${lat}, Longitude ${lng}`);
          }
        });
        window.addEventListener("resize", () => newMap.getViewPort().resize());
          // Set the map object to the reference
          map.current = newMap;
        }
      }
    },
    // Dependencies array
    [apikey]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        display: "flex",
        justifyContent: "center",
      }}
      ref={mapRef}
    />
  );
};

export default HereMapDrawArea;