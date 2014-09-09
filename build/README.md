
===============

Build Tools
-----------

###This folder contains build tools.

To setup **Build Tools**:

* Execute `npm install -g grunt-cli`
* Install <a href="http://rubyinstaller.org/"> Ruby </a>
* Execute `gem update --system && gem install compass`
* Open a shell in this directory and execute `npm install` to install dependencies. 
* Thats All!

Disclaimer: May take a while to install, but its worth it. Makes life easier and faster!

###It will create a `node_modules` folder, please add it to your .gitignore file

Build Commands:

* `grunt build` compile scss,javascript and html partials to the www folder. To test simply run emulator.

Suggest more and I will add them or go ahead yourself by editing Gruntfile.js