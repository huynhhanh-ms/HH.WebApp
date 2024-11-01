export interface FuelImportSession {
  id: number;
  fuelImportId: number;
  sessionId: number;
  volumeUsed: number;
  createdAt: string; // Hoặc có thể là Date nếu bạn xử lý Date ở các nơi trong code
  updatedAt: string; // Hoặc có thể là Date
  salePrice: number;
}