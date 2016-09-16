# Project Migration Scripts

Migration scripts are designed to assist in automating the process of upgrading and making project wide changes across a lot of files.

The scripts in this folder are designed to come and go as needed. They can be run using the `run` command provided by the CLI.

Any script in this folder when run with this command can expect to run in a special context where the `project` global variable is available and can be used to access metadata or other commands and helpers such as those provided by `fs-extra` and `shelljs`
