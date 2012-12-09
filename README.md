# What is it?

As it's name suggests, it is a CMS written in Node.js.  Node was chosen because of it's high performance and it's low memory consumption.

**Contributors**

* [Erick Rojas](http://www.github.com/erickthered/)

# Current Status

Current version is 0.0.x, it's currently a proof of concept of the system's architecture.

Although it provides means to retrieve, insert, update and delete articles, it doesn't have any sort of security mechanism.

# Requirements

* [node.js](http://www.nodejs.org) 0.8.x+ and npm 1.1.x+
* [MongoDB](http://www.mongodb.org) 2.0.x+
* [Git](http://git-scm.com/) 1.7.5+

These are the oldest versions which CmsJS has been tested on (and works!).  Probably some older versions should work, but, it's always recommended that you have the latest stable versions available.

The following nodejs modules will be installed:

* express
* jade
* jshashes
* markdown
* mongodb
* mongoose
* nodeunit

So far, mongoose has not been used, but at some point there's a good chance that it will be easier to specify the models using this module.

# Installation

## Quick Install

If you are in a hurry, or if you don't mind knowing what you do :), just issue the following commands at the location where you want CmsJS to live in your hard drive.

    git clone git://github.com/erickthered/cmsjs.git
    cd cmsjs
    npm install
    node app.js

Then you just point your browser to:

    http://servername:7777/

Assuming you don't have any special requirements for your mongo database (port no 27017, username and password), you should see the main page of **cmsjs**.

## Get the source code from GitHub

The first thing you should do, is open your command line.  Then go to the folder where you want CmsJS to reside. (e.g. /var/www/), keep in mind that a new folder `cmsjs` will be created when you clone the repository.

Then just type the following command:

    git clone git://github.com/erickthered/cmsjs.git 

After it's finnished, there should be a new folder/directory named `cmsjs`. (e.g. /var/www/cmsjs).  Now, just change the current directory:

    cd cmsjs

 Now you're ready to install the module dependencies for this project.

## Installing required modules

Like any other Node.js project, the `package.json` defines the required modules.  To install the libraries, just type

    npm install

After a while, all libraries should have been installed.  Check for a folder called `node_modules` and there you should be able to see one directory for every module that has been installed.

## Running Tests (Optional)



## Run cmsjs

To run CmsJS, you should have `mongod` running in your machine.  Once you've checked that status of mongoDB, you can start the application with the following command:

    node app.js

It should display the following messages:

    Starting CmsJS on port 7777
    Initialing Core...
    Initializing ADMIN routes
    Initializing ARTICLE routes...
    Initializing INDEX routes...
    Initializing MENU routes...
    Initializing USER routes...

This tells you that the application started successfully and informs you about the port it is using.  Now you can point your browser to:

    http://localhost:7777/

And you should see CmsJS start page.

## Heroku deployment (Optional)

# Configuration

In order to be able to add content to the site, you have to craete a `users` collection in you database, and insert and object with the username and the SHA512 encrypted password that you desire.

For example if you wanted to use `foo` as the *username*, and `foobar` as the *password*, you would do something like this:

    mongo
    > db.users.insert({ username: 'foo', password: '0a50261ebd1a390fed2bf326f2673c145582a6342d523204973d0219337f81616a8069b012587cf5635f6925f1b56c360230c19b273500ee013e030601bf2425' });

Now you can point your browser to: `http://localhost:7777/login` and use the username and password that you inserted to add some content to the site.

# Roadmap

* **Ver. 0.1** - Basic blog functionality (articles and comments) with integrated editor.  Basic authentication but no user management.
* **Ver. 0.2** - Support for *static* pages and file uploads (resources).
* **Ver. 0.3** - Article categories and RSS feeds.  Navigation menus.
* **Ver. 0.4** - Facebook and Twitter Integration: Likes and autotweet based on RSS feed.
* **Ver. 0.5** - Improved security, user and role management, Configuration Panel.
* **Ver. 0.6** - Sitemap and basic SEO (keywords and description)
* **Ver. 0.7** - Themes
* **Ver. 0.8** - Integrated stats (most visited URL, most active author, most active commenter)
* **Ver. 0.9** - Basic workflow support.
* **Ver. 1.0** - Content versioning.