import expect from 'expect';

import reducer from '../../../frontend/src/reducers/groups';
import { GROUP_SUCCESS } from '../../../frontend/src/constants/groups';
import { FETCH_USERS_BY_GROUP_SUCCESS } from '../../../frontend/src/constants/users';

describe('groups reducer', () => {

  it('should return the initial state', () => {
    const state = {1: {}};
    expect(reducer(state, {})).toEqual(state);
  });

  it('should add a group', () => {
    const groups = {
      1: {name: 'New York'}
    };
    const state = reducer(undefined, {
      type: GROUP_SUCCESS,
      groups
    });

    expect(state).toEqual(groups);
  });

  it('should add users inside a group with the role', () => {
    const member = {
      id: 1,
      role: 'MEMBER'
    };
    const backer = {
      id: 2,
      role: 'BACKER'
    };
    const groupid = 9;

    const state = reducer(undefined, {
      type: FETCH_USERS_BY_GROUP_SUCCESS,
      users: {
        1: member,
        2: backer
      },
      groupid
    });

    expect(state).toEqual({
      [groupid]: {
        usersByRole: {
          MEMBER: [member],
          BACKER: [backer]
        }
      }
    });
  });
});
