export enum AccountStatus {
	Active= "Active",
	Inactive = "Inactive",
}

export enum Role {
  admin = "admin",
  staff = "staff",
  manager = "manager",
}

export interface AccountResponse {
	id: number;
	username: string;
	fullname: string;
	email: string;
	phone: string;
	role: Role;
	status: AccountStatus;
	isFree: boolean;
	taskCount: number;
}
