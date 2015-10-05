# Contributing Guide for Study Agenda developers

- We will not use the 'master' branch for development.
- Instead, we have a branch called 'development' which is our default base development branch.
- We will not push into 'master' or 'development' branches. Instead, each of us will be working on a separate branch that will be merged to 'development' (using the GitHub website).

## Cloning for the first time

- Fork the repo on GitHub.
- Clone the repository and go to the project directory:
```
  git clone https://github.com/[YOUR_USERNAME]/study-agenda-dev.git
  cd study-agenda-dev
```
- Add the main repository as a remote:
```
  git remote add upstream https://github.com/davidnovodchuk/study-agenda-dev.git
```

## Contributing:

- When developing something, you should first create an issue with what you will be working on. 
- I created an issue called "Demonstration issue" and assigned it to miself.
- If you go inside the issue on GitHub you will see a "#3" sting next to the issue name. it means that this is a issue number 3 of this repository. The numver of the issue is important because based on this I will create a local branch that will fix issue number 3.
- In terminal, I pull latest changes from development branch:
```
  git checkout development
  git pull upstream development
```
- Then, I create a new branch that I will be working on and will fix the issue I am assigned to:
```
  git checkout -b issue3
```
- I called my local branch "issue3" so I will know what issue it solves. It is very useful when you have several issues you are working on.
- I wrote some genious code, now I want to push it so somebody will review it:
```
  git status // see what files were modified
  git add --all // adding all changed I made
  git commit
```
- This part is very important: after doing git commit, an editor will be opened so you will be able to write the commit message. The first commit message in the branch should have the following context:
```
  Title (usually same as issue title)
   
  Body (usually same as issue body)
  
  Fixes #3
```
- The important part is the last line that specifies the issue number you are fixing. It is important because once you branch is merged with the base branch ('development'), it automatically closes the issue related to the branch.
- Now we can push the first commit:
```
  git push origin issue3 // git push origin BRANCH_NAME
```
- After pushing, we need to crete a pull request so someboty else will review your changed:
- On Github, go to your fork of this repository. At the top you will see the just pushed branch name and a button that says "Compare & Pull Request". This is how you create a pull request.
- You will be able to see a demonstration issue and pull request in this branch.

### Merging Pull Request

- The only way we will add new code to the development branch is by merging pull request after a review was done and approved.
- IMPORTANT: After a review is approved, all the commits in the approved pull requst should be "squashed" into one commit so only one commit is added to the development brach that has all the chages done in the merged branch.
- Here is how you squash:
- First, got to development branch and pull latest changes:
```
  git checkout development
  git pull upstream development
```
- Let's say I want to squash all commits in branch 'issue9', I first go to issue9 branch:
```
  git checkout issue9
```
- Then, rebase:
```
  git rebase -i upstream/development
```
- An editor will be opened with summery of all your commits that are done in the branch and are not in development branch.
- Before each commit there is the string "pick". leave the first pick (the first commit message), and put "f" instead of all other "pick"s and save. This will squash all the commits into one commit that will have the commit message of the first commit.
- Then, if there are no conflicts, all your commits will be squashed and added to the latest development code. In this way you make sure there are no conflicts and the branch can be merged into development.
- Push the changes, add "--force" when you push because you changed the commits history and without "--force" you won't be able to push:
```
  git push origin issue9 --force
```
