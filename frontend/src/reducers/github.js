import merge from 'lodash/object/merge';
import {
  GET_REPOS_FROM_GITHUB_SUCCESS,
  GET_CONTRIBUTORS_FROM_GITHUB_SUCCESS,
  GET_USER_FROM_GITHUB_SUCCESS
} from '../constants/github';
import { HYDRATE } from '../constants/session';


export default function github(state={}, action={}) {
  switch (action.type) {

    case HYDRATE:
      if (action.data.connectedAccount) {
        return merge({}, state, {
          connectedAccount: action.data.connectedAccount,
        });
      }
      return state;

    case GET_REPOS_FROM_GITHUB_SUCCESS:
      const repositories = action.json.map(repo => {
        return {
          title: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          owner: repo.owner.login
        };
      });
      return merge({}, state, { repositories });

    case GET_CONTRIBUTORS_FROM_GITHUB_SUCCESS:
      const contributors = action.json.map(contributor => {
        return {
          name: contributor.login,
          avatar: contributor.avatar_url,
          contributions: contributor.contributions,
        };
      });
      return merge({}, state, { contributors });

    case GET_USER_FROM_GITHUB_SUCCESS:
      const user = {};
      ['id', 'login', 'name', 'email', 'blog'].forEach((key) => user[key] = action.json[key]);
      return merge({}, state, { user });

    default:
      return state;
  }
}