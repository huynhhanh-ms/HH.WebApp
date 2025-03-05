export interface GeoJson {
  type: string;
  coordinates: number[][][]; // GeoJSON Polygon
}

export interface Land {
  id: string;
  name: string;
  type: string;
  area: number;
  location: GeoJson;
  html: string;
}

export interface CreatedLand {
  name: string;
  type: string;
  area?: number;
  location: GeoJson;
  html?: string;
}

export function isCoordinates(value: any): value is number[][][] {
  return (
    value.length &&
    value[0].length &&
    value[0][0].length &&
    Array.isArray(value) &&
    value.every(
      (arr1) =>
        Array.isArray(arr1) &&
        arr1.every((arr2) => Array.isArray(arr2) && arr2.every((num) => typeof num === 'number'))
    )
  );
}

export type MergedType = LandType | LandObjectType;

export enum LandType {
  Default = 'Đất',

  NewLand = 'Đất mới',
  // 🏡 Đất Nông Nghiệp (Agricultural Land)
  Farm = 'Đất nông nghiệp',
  RiceField = 'Ruộng lúa',
  CornField = 'Ruộng ngô',
  VegetableFarm = 'Đất trồng rau',
  FruitOrchard = 'Vườn cây ăn trái',
  TeaFarm = 'Đồi chè',
  CoffeeFarm = 'Đồn điền cà phê',
  RubberFarm = 'Đất trồng cao su',

  // 🏢 Đất Phi Nông Nghiệp (Non-Agricultural )
  Residential = 'Đất thổ cư',
  Industrial = 'Đất công nghiệp',
  Commercial = 'Đất thương mại',
  Public = 'Đất công cộng',

  // 🌲 Đất Tự Nhiên (Natural )
  Forest = 'Đất rừng',
  Wet = 'Đất ngập nước',
  Mountain = 'Đất đồi núi',

  // 🚧 Đất Hạ Tầng (Infrastructure )
  Road = 'Đất giao thông',
  Dam = 'Đất xây đập thủy lợi',
  Electricity = 'Đất điện lực',
}

export enum LandObjectType {
  Default = 'Đối tượng',
  Tree = 'Cây',
  House = 'Nhà',
  Water = 'Nước',
  Road = 'Đường',
  Bridge = 'Cầu',
  Dam = 'Đập',
  PowerLine = 'Đường dây điện',
  Pole = 'Cột điện',
  Substation = 'Trạm biến áp',
  Pump = 'pump',
  ElectricPole = 'electric_pole',
}
