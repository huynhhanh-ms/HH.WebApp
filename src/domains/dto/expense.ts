export interface Expense {
  id: number;
  sessionId: number;
  expenseTypeId: number;
  expenseTypeName: string;
  amount: number;
  note: string;
  debtor: string;
  image: string;
  createdAt: Date;
}
