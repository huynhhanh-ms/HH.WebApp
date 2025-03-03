interface IApiQueryKey {
  [module: string]: {
    [func: string]: string;
  } | string;
}

export const ApiQueryKey = {
  account: {
    StaffInfo: 'STAFF_INFO',
    getAll: 'ACCOUNTS',
    create: 'CREATE_STAFF',
    updateStatus: 'UPDATE_STATUS',
    updateInformation: 'UPDATE_INFO',
    deleteAccount: 'DELETE_ACCOUNT',
    count: 'COUNT_ACCOUNT',
  },
  auth: {
    login: 'LOGIN',
    me: 'ME',
    logout: 'LOGOUT',
    refreshToken: 'REFRESH_TOKEN',
  },
  tank : "TANK",
  tank_history : "TANK_HISTORY",
  fuelImport : "FUEL_IMPORT",
  session : "SESSION",
  sessionDetail : "SESSION_DETAIL",
  petrolPump : "PETROL_PUMP",
  expense : "EXPENSE",
  expenseType : "EXPENSE_TYPE",
  weighingHistory : "WEIGHING_HISTORY",
  land : "LAND",
};
