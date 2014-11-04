module.exports = function(grunt) {

    var devConfig = require('./dev/server/config');
    var testConfig = require('./test/server/config');
    var prodConfig = require('./dist/server/config');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            tmp: ["tmp/*"],
            dist: [
                "dist/*",
                "!dist/server",
                "!dist/server/config"
            ],
            dev: [
                "dev/*", 
                "!dev/server",
                "!dev/server/config",
                "!dev/server/server.js" // we overwrite server.js to get it restarted by nodemon
            ],
            test: [
                "test/*",
                "!test/server",
                "!test/server/config",
            ],
        },
        jade: {
            dev: {
                options: {
                    pretty: true,
                    data: {is_dev: true, host: devConfig.host}
                },
                files: {"tmp/index.html": "src/client/index.jade"}
            },
            prod: {
                options: {
                    pretty: true,
                    data: {is_prod: true}
                },
                files: {"tmp/index.html": "src/client/index.jade"}
            },
            test: {
                options: {
                    pretty: true,
                    data: {is_test: true}
                },
                files: {"tmp/index.html": "src/client/index.jade"}     
            }
        },
        jshint: {
            files: [
                'Gruntfile.js', 
                'src/client/**/*.js', 
                'src/server/**/*.js',
                'spec/**/*.js'
            ]
        },
        copy: {
            dev: {
                files: [
                    {src: 'src/server/server.js', dest: 'dev/server/server.js'},
                    {src: 'tmp/client.concat.js', dest: 'dev/client/js/client.concat.js'},
                    {src: 'tmp/client.concat.css', dest: 'dev/client/css/client.concat.css'},
                    {expand: true, cwd: 'bower_components/bootstrap/', src: 'fonts/**', dest: 'dev/client/'},
                    {src: 'tmp/index.html', dest: 'dev/client/index.html'},
                    {expand: true, cwd: 'src/client/', src: 'partials/*', dest: 'dev/client/'}
                ]
            },
            dist: {
                files: [
                    {src: 'src/server/server.js', dest: 'dist/server/server.js'},
                    {src: 'tmp/client.min.js', dest: 'dist/client/js/client.min.js'},
                    {src: 'tmp/client.min.css', dest: 'dist/client/css/client.min.css'},
                    {expand: true, cwd: 'bower_components/bootstrap/', src: 'fonts/**', dest: 'dist/client/'},
                    {src: 'tmp/index.html', dest: 'dist/client/index.html'},
                    {expand: true, cwd: 'src/client/', src: 'partials/*', dest: 'dist/client/'}
                ]
            },
            test: {
                files: [
                    {src: 'src/server/server.js', dest: 'test/server/server.js'},
                    {src: 'tmp/client.min.js', dest: 'test/client/js/client.min.js'},
                    {src: 'tmp/client.min.css', dest: 'test/client/css/client.min.css'},
                    {expand: true, cwd: 'bower_components/bootstrap/', src: 'fonts/**', dest: 'test/client/'},
                    {src: 'tmp/index.html', dest: 'test/client/index.html'},
                    {expand: true, cwd: 'src/client/', src: 'partials/*', dest: 'test/client/'}
                ]
            }
        },
        watch: {
            files: [
                'Gruntfile.js',
                'src/**',
                'spec/**'
            ],
            tasks: ['dev'],
            options: {
                livereload: 35729,
                spawn: false // dont create a new process if one is already running
            }
        },
        concat: {
            js_app: {
                src: [
                    'src/client/js/main.js',
                    'src/client/js/controllers.js',
                    'src/client/js/services.js',
                    'src/client/js/directives.js'
                ],
                dest: 'tmp/app.concat.js'
            },
            js_vendor: {
                src: [
                    'bower_components/angular/angular.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.js',
                    'bower_components/angular-mocks/angular-mocks.js',
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                ],
                dest: 'tmp/vendor.concat.js'
            },
            js: {
                src: [
                    'tmp/vendor.concat.js',
                    'tmp/app.concat.js'
                ],
                dest: 'tmp/client.concat.js'
            },
            css: {
                src: ['bower_components/**/*.min.css', 'src/**/*.css'],
                dest: 'tmp/client.concat.css'
            }
        },
        uglify: {
            files: {src: ['tmp/client.concat.js'], dest: 'tmp/client.min.js'}
        },
        cssmin: {
            files: {src: ['tmp/client.concat.css'], dest: 'tmp/client.min.css'}
        },
        jasmine: {
            files: {src: 'tmp/app.concat.js'},
            options: {
                vendor: 'tmp/vendor.concat.js',
                specs: 'spec/unit/client/*.js',
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'coverage/coverage.json',
                    report: 'coverage'
                }
            }
        },
        jasmine_node: {
            server: ['spec/unit/server/']
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-jasmine-node');
  
    grunt.registerTask('dev', [
        'clean:tmp',
        'jade:dev',
        'jshint', 
        'concat_all',
        'clean:dev',
        'copy:dev',
        'watch'
    ]);

    grunt.registerTask('prod', [
        'clean:tmp',
        'jade:prod',
        'jshint',
        'concat_all',
        'uglify',
        'cssmin',
        'clean:dist',
        'copy:dist'
    ]);

    grunt.registerTask('test', [
        'clean:tmp',
        'jade:test',
        'jshint',
        'concat_all',
        'uglify',
        'cssmin',
        'clean:test',
        'copy:test',
        'jasmine',
        'jasmine_node:server'
    ]);

    grunt.registerTask('concat_all', [
        'concat:js_app',
        'concat:js_vendor',
        'concat:js',
        'concat:css',
    ]);

};
