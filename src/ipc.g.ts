// ở đây khai báo method mà renderer process có thể gọi đến main process
// define dạng này để tránh lỗi khi gọi method từ renderer process đến main process
// tự máp tay

declare global {
  interface Window {
    electronApi: {
      setTitle: (title: string) => void;
      
    };
  }
}

// Đảm bảo rằng tệp này được coi là một mô-đun bằng cách thêm dòng này:
export {};
