env=$1

# current branch name
current_branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
current_branch_name="(unnamed branch)"     # detached HEAD

current_branch_name=${current_branch_name##refs/heads/}

# Set env variables
if [ $env = "staging" ]
then
  branch_name="staging"
  remote="https://git.heroku.com/opencollective-staging-website.git"
elif [ $env = "production" ]
then
  branch_name="production"
  remote="https://git.heroku.com/opencollective-prod-website.git"
else
  echo "Unknown env: $env, only staging and production are valid"
  exit
fi

# Create branch for first time user or checkout existing one
if [[ `git branch --list $branch_name ` ]]
then
  git checkout $branch_name
else
  git checkout -b $branch_name master
fi

# Get latest changes on github
git fetch origin

# Merge github master branch
git merge origin/master

# Increase version number
npm version patch

# Update on github
git push origin $branch_name

# Push to heroku
git push $remote $branch_name:master

# Go back to the previous branch before deploying
git checkout $current_branch_name