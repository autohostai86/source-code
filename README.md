<!-- @format -->

# HOW TO SETUP GIT HOOK PREPARE COMMIT MSG

[linux]

1.copy `vdigidocker/configs/git-hooks/prepare-commit-msg` to .git/hooks directory

it will add the issue number directly in your commit message

[windows]

1. Make sure you are using bash shell terminal.

2. Now nevigate to the .git/hooks

3. using vim create file with name "prepare-commit-msg"

4. copy content of `vdigidocker/configs/git-hooks/prepare-commit-msg` to .git/hooks directory

5. save file and we are done with git hook setup😎.

it will add the issue number directly in your commit message

# JIRA USE IN VS CODE

1. download `Jira and Bitbucket (Atlassian Labs)` extension in vs code

2. open settings for Jira and Bitbucket (Atlassian Labs) from vs code command palette

3. add your login credentials (it will open browser login there with bitbucket vinnovate account)

4. after login open Jira view from vs code command palette you can see your assigned issues there

5. and start working and creating branches from issues :)

---

# HOW TO COMMIT CODE PATTERN

**follow below commit rules strictly while pushing code.**

feat: add hat description

|----| |---------------------|

| |

| +-> Summary and description in the present tense. don't use added, pushing, created instead use add, push, create

|

+-------> Type: chore, docs, feat, fix, refactor, style, or test.

ref links:
real-life example:
https://github.com/eslint/eslint/commits/master

article links:
https://dev.to/i5han3/git-commit-message-convention-that-you-can-follow-1709
https://www.conventionalcommits.org/en/v1.0.0/
https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716

---

# -TODO WHEN ISSUE IS ASSIGNED

**From browser**

1. check issues on bitbucket > Jira issues > filter issue with your name
2. click on an issue to open it will open a popup
3. when you start work on your respective issue click on create a branch
4. from creating branch screen select source branch dev, select branch type feature, hotfix, etc from the menu
5. click on create. your branch will be created online
6. in your local environment pull this respective branch and checkout to this and start working

---

**From vs code**

1. as mentioned above configure bitbucket extension on vs code
2. click on Jira issue view
3. click on the refresh button you will see your latest assigned issues on the side panel
4. to start work right click on the issue and select start work
5. It will open a new window. select respective options.
6. this will create a local branch and automatically switch to it
7. start working on your branch

---

# AUTOMATIC CHANGE JIRA ISSUE STATUS FROM COMMIT MESSAGES

At the end of the git commit message add below rules

`#time 2d,2h,2m` : To add worked time log
`#comment to add any extra comment on Jira issue` : To add worked time log
`#done` `#in process` `#to do` to change the Jira issue status

eg. `git commit -m "#resolve #time 2d 5h #comment Task completed ahead of schedule"`

[for more detail follow this link](https://support.atlassian.com/bitbucket-cloud/docs/use-smart-commits)

**IMP NOTE**

Jira smart commit requires bitbucket user name and email configuration in git

you can add git user name and email in global as well as local repo.

1. To add user name and email on global use below command
   user name: `git config --global user.name "yourUserName"`
   user email `git config --global user.email "your@email.com"`

1. To add user name and email on local repo use below command
   user name: `git config user.name "yourUserName"`
   user email `git config user.email "your@email.com"`

---

# CHECK ASSIGNED JIRA ISSUES FROM CODE COMMENT

1. some issues are getting created from code comments. with the respective file included inside the issue
2. follow the above steps to fix the issue
3. and create a pull request

---

# WRITING CLEAN CODE PRINCIPLE

1. use proper meaning full names for variables don't use names like I,j,k,
2. write proper comments inside the code. write as a storyline what is happening in short.
3. divide large code blocks into small functions and methods. don't have a large chunk of code in a single function.
4. create services. and always write business logic in services.
5. don't write hardcoded things if any hardcoded thing is added then mention it in the comment

---

## PROJECT DEPENDANCIES:

1.  docker
2.  yarn or npm package manager with nodejs

note: docker on linux use as not root user follow below guide
https://docs.docker.com/engine/install/linux-postinstall

it will execute docker commands without sudo

# PROJECT INITIAL SETUP AND TODO

0. to init project with dependencies on first time
   `yarn prepare:project`

    it will install all dependancies
    follow husky setup point to setup husky

1. TO BUILD THE PROJECT
   ` yarn docker:build-up`

2. TO INSTALL SERVER AND CLIENT DEPENDANCIES
   `yarn docker:project-install`

    this will start installing dependancies

3. TO START THE PROJECT

    client: `yarn docker:client-start`
    server: `yarn docker:server-start`

4. TO INSTALL NEW DEPENACIES IN CLIENT OR SERVER
   `yarn docker:project-add <package_name>`

---

NOTE: for windows os if any command not work then create a new command by removing sudo

### HUSKY SETUP

1.move configs/husky/pre-commit file to .husky folder

### GIT HOOK SETUP

1.move configs/git_hooks/prepare-commit-msg file to .git/hooks folder


