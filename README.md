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
mkdir -p dev/server
mkdir -p dist/server
mkdir -p test/server
cp src/server/config.sample dev/server/config
cp src/server/config.sample dist/server/config
cp src/server/config.sample test/server/config
vim dev/server/config
vim dist/server/config
vim test/server/config
```

## Running development

```
grunt dev
nodemon dev/server/server.js (in other console)
```

## Running production

```
grunt prod
forever start --uid "simpleform" --append -l /var/log/simpleform/forever.log -o /var/log/simpleform/debug.log -e /var/log/simpleform/error.log dist/server/server.js
```

## Running tests

```
grunt test
```
