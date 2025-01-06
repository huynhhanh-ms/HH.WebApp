export interface Tank {
  id: number;
  name: string;
  type?: string;
  typeId?: string;
  height?: number;
  currentVolume: number;
  capacity: number;
  note?: string;
  createdAt?: string;
}