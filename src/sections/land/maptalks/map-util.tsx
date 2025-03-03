import type { MergedType } from 'src/domains/dto/land';

import * as maptalks from 'maptalks';

import { LandType, LandObjectType } from 'src/domains/dto/land';

export const getOrCreateLayer = (map: maptalks.Map, layerId: string, isClear = false) => {
  let layer = map.getLayer(layerId) as maptalks.VectorLayer;
  if (!layer) {
    layer = new maptalks.VectorLayer(layerId).addTo(map);
  } else if (isClear) layer.clear();
  return layer;
};

const addPolygon = (map: maptalks.Map, layerId: string, coordinates: number[][][], type: MergedType) => {
  if (!map) return;

  console.log('🛖 render polygon', layerId);
  const layer = getOrCreateLayer(map, layerId);
  const symbol = getSymbolByType(type);

  new maptalks.Polygon(coordinates as any, { symbol }).addTo(layer);
};
const getSymbolByType = (type: MergedType) => {
  const symbols: Record<MergedType, any> = {
    // LandType
    [LandType.Default]: {
      lineColor: "#1a1a1a",
      lineWidth: 2,
      polygonFill: "#777777",
      polygonOpacity: 0.4,
    },
    [LandType.Farm]: {
      lineColor: "#00aa00",
      lineWidth: 2,
      polygonFill: "#88ff88",
      polygonOpacity: 0.5,
    },
    [LandType.Residential]: {
      lineColor: "#aa5500",
      lineWidth: 2,
      polygonFill: "#ffcc88",
      polygonOpacity: 0.6,
    },

    // LandObjectType
    [LandObjectType.Bridge]: {
      lineColor: "#ff0000",
      lineWidth: 2,
      polygonFill: "#ff8888",
      polygonOpacity: 0.7,
    },
    [LandObjectType.Pump]: {
      lineColor: "#ff8800",
      lineWidth: 2,
      polygonFill: "#ffcc88",
      polygonOpacity: 0.6,
    },
    [LandObjectType.Water]: {
      lineColor: "#0000ff",
      lineWidth: 2,
      polygonFill: "#55aaff",
      polygonOpacity: 0.6,
    },
    [LandType.RiceField]: undefined,
    [LandType.CornField]: undefined,
    [LandType.VegetableFarm]: undefined,
    [LandType.FruitOrchard]: undefined,
    [LandType.TeaFarm]: undefined,
    [LandType.CoffeeFarm]: undefined,
    [LandType.RubberFarm]: undefined,
    [LandType.Industrial]: undefined,
    [LandType.Commercial]: undefined,
    [LandType.Public]: undefined,
    [LandType.Forest]: undefined,
    [LandType.Wet]: undefined,
    [LandType.Mountain]: undefined,
    [LandType.Road]: undefined,
    [LandType.Dam]: undefined,
    [LandType.Electricity]: undefined,
    [LandObjectType.Default]: undefined,
    [LandObjectType.Tree]: undefined,
    [LandObjectType.House]: undefined,
    [LandObjectType.ElectricPole]: undefined,
    [LandObjectType.Road]: undefined,
    [LandObjectType.Dam]: undefined,
    [LandObjectType.PowerLine]: undefined,
    [LandObjectType.Pole]: undefined,
    [LandObjectType.Substation]: undefined
  };

  return symbols[type] || symbols[LandType.Default];
};





// ==================================================================================================================
const extractImportantHtml = (htmlString: string | undefined) => {
  if (!htmlString) return null;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Lấy phần tiêu đề
  const titleEl = doc.querySelector(".sqh-pin-inf__tle");
  const titleHtml = titleEl ? titleEl.innerHTML : "";

  // Lấy phần địa chỉ (Xóa tất cả các thẻ <a>)
  const addressEl = doc.querySelector(".sqh-pin-inf__adr");
  if (addressEl) {
    addressEl.querySelectorAll("a").forEach((a) => a.replaceWith(a.textContent || ""));
  }
  const addressHtml = addressEl ? addressEl.innerHTML : "";

  // Lấy phần thông tin loại đất
  const typeInfoEl = doc.querySelector(".type-info");
  const typeInfoHtml = typeInfoEl ? typeInfoEl.innerHTML : "";

  return (
    <div>
      {titleHtml && <div dangerouslySetInnerHTML={{ __html: titleHtml }} />}
      {addressHtml && <div dangerouslySetInnerHTML={{ __html: addressHtml }} />}
      {typeInfoHtml && <div dangerouslySetInnerHTML={{ __html: typeInfoHtml }} />}
    </div>
  );
};

export const HtmlAreaInfo = ({ html }: { html: any }) => <div>{extractImportantHtml(html)}</div>;


const freeMapLayer = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
const googleMapLayer = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
const googleSatelliteLayer = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
// export const EsriWorldImagery = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

export const MapUtil = {
  getOrCreateLayer,
  freeMapLayer,
  googleMapLayer,
  googleSatelliteLayer,
  extractImportantHtml,
  HtmlAreaInfo,
  addPolygon,
}