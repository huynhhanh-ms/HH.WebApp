// Define an enum for weighing_status if it has specific values
enum WeighingStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  // Add other statuses as needed
}

interface WeighingHistory {
  wh_id: number;                     // Unique identifier for the weighing history entry
  customer_name: string;             // Name of the customer (default: 'Vô Danh')
  address?: string;                  // Address of the customer (optional)
  goods_type?: string;               // Type of goods (optional)
  license_plate?: string;            // License plate of the vehicle (optional)
  total_weight?: number | null;      // Total weight (optional, nullable)
  vehicle_weight?: number | null;    // Weight of the vehicle (optional, nullable)
  goods_weight?: number | null;      // Weight of the goods (optional, nullable)
  total_weighing_date?: Date | null; // Date of total weighing (optional, nullable)
  vehicle_weighing_date?: Date | null; // Date of vehicle weighing (optional, nullable)
  note?: string | null;              // Additional notes (optional, nullable)
  vehicle_images?: string[] | null;  // Array of vehicle images (optional, nullable)
  // weighing_status: WeighingStatus;   // Status of the weighing
}
