import { createSelector } from 'reselect';

export const getTransactionsSelector = (state) => state.transactions;

export const getDonationsSelector = createSelector(
	getTransactionsSelector,
	transactions => transactions.donations);

export const getPaidExpensesSelector = createSelector(
	getTransactionsSelector,
	transactions => transactions.expenses);