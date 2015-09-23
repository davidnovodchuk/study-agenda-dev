Contributing Guide for Study Agenda developers:

- We will not use the 'master' branch for development.
- Instead, we have a branch called 'development' which is our default base development branch.
- We will not push into 'master' or 'development' branches. Instead, each of us will be working on a separate branch that will be merged to 'development' (using the GitHub website).

Cloning for the first time

- Fork the repo on GitHub.
- Clone the repository and go to the project directory:
```
  git clone https://github.com/davidnovodchuk/study-agenda-dev.git
  cd study-agenda-dev
```
- Add the main repository as a remote:
```
  git remote add upstream git@github.com:davidnovodchuk/study-agenda-dev.git
```

Contributing:

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
- This part is very important: after 
