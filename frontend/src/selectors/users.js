import { createSelector } from 'reselect';

export const getUsersSelector = (state) => state.users;

export const getNewUserSelector = createSelector(
	getUsersSelector,
	(users) => users.newUser || {});

export const getUpdateInProgressSelector = createSelector(
	getUsersSelector,
	(users) => users.updateInProgress);