import type { Tank } from "./tank";

export interface PetrolPump {

  id: number;
  sessionId: number;
  tankId: number;
  startVolume: number;
  endVolume: number;
  totalVolume: number;
  revenue: number;
  tank?: Tank;

  price: number;

}
