# OpenCollective Devtools Global-CLI

The purpose of this CLI is to be installed globally.

When you run it, it will find out where in the OpenCollective project
system you are located and search upwards from there for a `package.json` file
which indicates that it is the provider of all of the project folder which has
all of the necessary devtooling and configuration information necessary.

This CLI will run tools such as webpack, mocha, eslint for you without requiring
you to install each of these and manage them independently inside every project we work on


