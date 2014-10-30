module.exports = function(grunt) {

    var config = require('./dev/server/config');

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
            ]
        },
        jade: {
            dev: {
                options: {
                    pretty: true,
                    data: {is_dev: true, host: config.host}
                },
                files: {"tmp/index.html": "src/client/index.jade"}
            },
            prod: {
                options: {
                    pretty: true,
                    data: {is_prod: true}
                },
                files: {"tmp/index.html": "src/client/index.jade"}
            }        
        },
        jshint: {
            files: [
                'Gruntfile.js', 
                'src/client/**/*.js', 
                'src/server/**/*.js'
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
            }
        },
        watch: {
            files: [
                'Gruntfile.js',
                'src/**',
                'test/**'
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
                src: ['bower_components/**/*.css', 'src/**/*.css'],
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
                specs: 'test/unit/client/*.js',
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'coverage/coverage.json',
                    report: 'coverage'
                }
            }
        },
        jasmine_node: {
            server: ['test/unit/server/']
        },
        wait_server: {
            dev: {
                options: {
                    url: 'http://' + config.host + ':' + config.port,
                    timeout: 1000 * 10,
                    interval: 100,
                    print: false
                }
            }
        },
        wait: {
            pause: {
                options: {delay: 500}
            }
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
    grunt.loadNpmTasks('grunt-wait-server');
    grunt.loadNpmTasks('grunt-wait');
  
    grunt.registerTask('dev', [
        'clean:tmp',
        'jade:dev',
        'jshint', 
        'concat:js_app',
        'concat:js_vendor',
        'concat:js',
        'concat:css',
        'clean:dev',
        'copy:dev',
        'wait:pause',
        'wait_server:dev',
        'jasmine',
        'jasmine_node:server',
        'watch'
    ]);

    grunt.registerTask('prod', [
        'clean:tmp',
        'jade:prod',
        'jshint',
        'concat:js_app',
        'concat:js_vendor',
        'concat:js',
        'concat:css',
        'uglify',
        'cssmin',
        'clean:dist',
        'copy:dist'
    ]);

};
