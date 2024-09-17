import { HttpStatusCode } from "axios";

interface ResponseObject<T> {
  data: T;
  message: string | null;
  statusCode: HttpStatusCode;
}
interface PagedList<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
	data: T[];
}
