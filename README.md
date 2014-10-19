simpleform
==========

A project to build a stack for a simple form using nodejs and angular.

## Article

[http://palsta.pulu.org/en/37-a-stack-needed-for-a-simple-form-using-angularjs-and-mysql](http://palsta.pulu.org/en/37-a-stack-needed-for-a-simple-form-using-angularjs-and-mysql)

## Installation

```
git checkout https://github.com/lassiheikkinen/simpleform.git
cd simpleform
npm install
bower install 
```

## Running development

```
mkdir -p dev/server
mv srv/server/config.sample dev/server/config
vim dev/server/config
nodemon dev/server/server.js
grunt dev
```

## Running production

```
mkdir -p dist/server
mv srv/server/config.sample dist/server/config
vim dist/server/config
grunt prod
forever start --uid "simpleform" --append -l /var/log/simpleform/forever.log -o /var/log/simpleform/debug.log -e /var/log/simpleform/error.log dist/server/server.js
```
