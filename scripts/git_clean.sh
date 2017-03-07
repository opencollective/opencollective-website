#!/bin/bash
if [[ `git checkout master` ]]; then 
  for BRANCH in `git branch | grep -v "*"`; do
    if [[ `git diff master..$BRANCH` ]]; then
      echo "> $BRANCH needs to be merged";
      git checkout $BRANCH;
      if git merge master -m "merging master into $BRANCH" 1> /dev/null; then
        git checkout master;
	git merge $BRANCH --ff-only;
        git branch -d $BRANCH;
      else
	echo "$BRANCH cannot be merged automatically, aborting";
	git merge --abort;
      fi;
    else 
      git branch -D $BRANCH;
    fi; 
  done;
  git checkout master;
fi;

