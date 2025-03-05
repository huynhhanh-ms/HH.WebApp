import { debounce } from 'lodash';
import H from '@here/maps-api-for-javascript';
import { useRef, useState, useEffect } from 'react';

import type { AreaAdmin } from '../entity/area';

type Props = {
  apikey?: string;
  area?: AreaAdmin;
  onPositionChange: (position: { lat: number, lng: number }) => void
}

const HereMapSelect = (props: Props) => {
  // const theme = useTheme();
  const mapRef = useRef(null);
  const map = useRef<H.Map | null>(null);
  const platform = useRef<H.service.Platform | null>(null)
  const [markerPosition, setMarkerPosition] = useState({ lat: 10.871592515732114, lng: 106.79497720296311 });
  const { apikey = "7h1jyg35V5JfNIgPA8m1XEN39K9giRbtrfNj8nJ5kd4", area, onPositionChange } = props;
  const debouncedUpdateMarkerPosition = debounce(newPosition => {
    setMarkerPosition(newPosition);
  }, 500);
  useEffect(() => {
    console.log(markerPosition);
    console.log(area);

    if (area && area?.boundaries) {
      const checkResult = isPointInPolygon(markerPosition, area?.boundaries)
      console.log(checkResult ? "IS not in area selected" : "IS not in area selected");

    }
  }, [markerPosition, area])
  useEffect(() => {
    onPositionChange(markerPosition)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerPosition])
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
        // Creates a new instance of the H.service.rasterTile.Provider class
        // The class provides raster tiles for a given tile layer ID and pixel format
        const rasterTileProvider = new H.service.rasterTile.Provider(
          rasterTileService
        );
        // Create a new Tile layer with the Raster Tile provider
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
          const behavior = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(newMap)
          );
          window.addEventListener('resize', () => newMap.getViewPort().resize());
          addDraggableMarker(newMap, behavior);
          // Set the map object to the reference
          map.current = newMap;
        }

      }
    },
    // Dependencies array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apikey]
  );
  function addDraggableMarker(Hmap: H.Map, behavior: H.mapevents.Behavior) {

    const marker = new H.map.Marker(markerPosition, {
      data: {
        // mark the object as volatile for the smooth dragging
        volatility: true
      },
      volatility: true
    });
    // Ensure that the marker can receive drag events
    marker.draggable = true;
    Hmap.addObject(marker);

    // disable the default draggability of the underlying map
    // and calculate the offset between mouse and target's position
    // when starting to drag a marker object:
    Hmap.addEventListener('dragstart', (ev: { currentPointer?: any; target?: any; }) => {
      const { target } = ev;
      const pointer = ev.currentPointer;
      if (target instanceof H.map.Marker) {
        const geometry = target.getGeometry();
        if (geometry instanceof H.geo.Point) {
          const targetPosition = Hmap.geoToScreen(geometry);
          if (targetPosition) {
            const offset = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
            target.setData({ offset });
          }
        }
        behavior.disable();
      }
    }, false);


    // re-enable the default draggability of the underlying map
    // when dragging has completed
    Hmap.addEventListener('dragend', (ev: { target: any; }) => {
      const { target } = ev;
      if (target instanceof H.map.Marker) {
        behavior.enable();
      }
    }, false);

    // Listen to the drag event and move the position of the marker
    // as necessary
    Hmap.addEventListener('drag', (ev: { currentPointer?: any; target?: any; }) => {
      const { target, currentPointer: pointer } = ev;
      if (target instanceof H.map.Marker) {
        const { offset } = target.getData();
        const newGeometry = Hmap.screenToGeo(pointer.viewportX - offset.x, pointer.viewportY - offset.y);
        if (newGeometry) {
          target.setGeometry(newGeometry);
        }
      }
      const { offset } = target.getData();
      const newPosition = Hmap.screenToGeo(pointer.viewportX - offset.x, pointer.viewportY - offset.y);
      debouncedUpdateMarkerPosition(newPosition);
    }, false);
  }
  return <div style={{ width: "100%", height: "500px", display: "flex", justifyContent: "center" }} ref={mapRef} />;
}
function isPointInPolygon(point: { lat: any; lng: any; }, polygon: string | any[]) {
  console.log(polygon);

  const x = point.lat;
  const y = point.lng;
  let isInside = false;

  // eslint-disable-next-line no-plusplus
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      isInside = !isInside;
    }
  }

  return isInside;
}
export default HereMapSelect