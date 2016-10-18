
// Formats results for `ContributorList` component
// Sorts results, giving precedence to `core` Boolean first, then Number of `commits`
export function formatGithubContributors(githubContributors) {
  return Object.keys(githubContributors).map(username => {
    const commits = githubContributors[username];
    return {
      core: false,
      name: username,
      avatar: `https://avatars.githubusercontent.com/${ username }?s=64`,
      href: `https://github.com/${username}`,
      stats: {
        c: commits,
        a: null,
        d: null,
      }
    }
  }).sort((A, B) => (B.core * Number.MAX_SAFE_INTEGER + B.stats.c) - (A.core * Number.MAX_SAFE_INTEGER + A.stats.c));
};