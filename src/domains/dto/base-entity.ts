export interface BaseEntity {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
  isSync?: boolean;
  isDeleted?: boolean;
}