import { get } from './api'

export const fetchActiveUsers = (slug, options) =>
  get(`/groups/${slug.toLowerCase()}/users?filter=active`, options)

export const fetchGroup = (slug) =>
   get(`/groups/${slug.toLowerCase()}/`)

export const fetchLeaderboard = () =>
  get('/leaderboard')

export const verifyGithubAccount = (token) =>
  get( '/connected-accounts/github/verify', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

export const fetchTransactions = (slug, options = {}) =>
  get(`/groups/${slug.toLowerCase()}/transactions?per_page=${options.perPage || 3}`)

export const fetchUsers = (slug) =>
  get(`/groups/${slug}/users`)
