env=$1

# current branch name
current_branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
current_branch_name="(unnamed branch)"     # detached HEAD

current_branch_name=${current_branch_name##refs/heads/}

# env vars
remote_staging="https://git.heroku.com/opencollective-staging-website.git"
remote_production="https://git.heroku.com/opencollective-prod-website.git"

# Get latest changes from github
# $1: name_of_branch
# ex: get_latest_branch master
get_latest_branch() {
  git fetch origin
  git checkout $1
  git merge origin/$1
}

# Pushes to a remote repo
# Assumes $from_branch is up to date
# $1: from_branch
# $2: to_branch
# $3: remote
# ex: push_to_repo master staging $remote_staging
push_to_repo() {
  from_branch=$1
  branch_name=$2
  remote=$3
  patch=$4

  # get the latest from_branch
  get_latest_branch $from_branch

  # clean local branches that have been merged
  npm run git:clean

  if [ $patch = "1" ]
  then
    npm version patch
  fi

  if [[ `git branch --list $branch_name ` ]]
  then
    git checkout $branch_name
    git merge $from_branch
  else
    git checkout -b $branch_name $from_branch
  fi

  git push origin $branch_name
  git push $remote $branch_name:master

  # Update remote $from_branch
  git push origin $from_branch
}

if [ $env = "staging" ]
then
  branch_name="staging"
  from_branch="master"

  # push to staging with a patch
  push_to_repo $from_branch $branch_name $remote_staging 1

elif [ $env = "production" ]
then
  branch_name="production"
  from_branch="staging"

  # push to production without a patch
  push_to_repo $from_branch $branch_name $remote_production 0

elif [ $env = "hotfix"]
then
  branch_name="production"
  from_branch="master"

  # push to production first with a patch
  push_to_repo $from_branch $branch_name $remote_production 1

  # push to staging without a patch
  branch_name="staging"
  push_to_repo $from_branch $branch_name $remote_staging 0

else
  echo "Unknown env: $env, only staging and production are valid"
  exit
fi

# Go back to the previous branch before deploying
git checkout $current_branch_name
