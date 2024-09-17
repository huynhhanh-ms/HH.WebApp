interface IApiQueryKey {
	[module: string]: {
		[func: string]: string
	};
}

export const ApiQueryKey = {
	account: {
		StaffInfo: "STAFF_INFO",
		getAll: "ACCOUNTS",
		create: "CREATE_STAFF",
		updateStatus: "UPDATE_STATUS",
		updateInformation: "UPDATE_INFO",
		deleteAccount: "DELETE_ACCOUNT",
		count: "COUNT_ACCOUNT",
	},
	auth: {
		login: "LOGIN",
		me: "ME",
		logout: "LOGOUT",
		refreshToken: "REFRESH_TOKEN",
	},
};

