import { createSelector } from 'reselect';

export const getExpensesSelector = (state) => state.expenses;

export const getUnpaidExpensesSelector = createSelector(
	getExpensesSelector,
	expenses => expenses.unpaid)

export const getApproveInProgressSelector = createSelector(
	getExpensesSelector, 
	expenses => expenses.approveInProgress);

export const getRejectInProgressSelector = createSelector(
	getExpensesSelector, 
	expenses => expenses.rejectInProgress);

export const getPayInProgressSelector = createSelector(
	getExpensesSelector, 
	expenses => expenses.payInProgress);