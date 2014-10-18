module.exports = function(grunt) {

    var config = require('./www_dev/server/config');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            tmp: ["tmp/*"],
            www_prod: [
                "www_prod/*",
                "!www_prod/server",
                "!www_prod/server/config"
            ],
            www_dev: [
                "www_dev/*", 
                "!www_dev/server",
                "!www_dev/server/config", 
                "!www_dev/server/server.js" // we overwrite server.js to get it restarted by nodemon
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
            www_dev: {
                files: [
                    {src: 'src/server/server.js', dest: 'www_dev/server/server.js'},
                    {src: 'tmp/client.concat.js', dest: 'www_dev/client/js/client.concat.js'},
                    {src: 'tmp/client.concat.css', dest: 'www_dev/client/css/client.concat.css'},
                    {expand: true, cwd: 'bower_components/bootstrap/', src: 'fonts/**', dest: 'www_dev/client/'},
                    {src: 'tmp/index.html', dest: 'www_dev/client/index.html'},
                    {expand: true, cwd: 'src/client/', src: 'partials/*', dest: 'www_dev/client/'}
                ]
            },
            www_prod: {
                files: [
                    {src: 'src/server/server.js', dest: 'www_prod/server/server.js'},
                    {src: 'tmp/client.min.js', dest: 'www_prod/client/js/client.min.js'},
                    {src: 'tmp/client.min.css', dest: 'www_prod/client/css/client.min.css'},
                    {expand: true, cwd: 'bower_components/bootstrap/', src: 'fonts/**', dest: 'www_prod/client/'},
                    {src: 'tmp/index.html', dest: 'www_prod/client/index.html'},
                    {expand: true, cwd: 'src/client/', src: 'partials/*', dest: 'www_prod/client/'}
                ]
            }
        },
        watch: {
            files: [
                'Gruntfile.js',
                'src/**',
            ],
            tasks: ['dev'],
            options: {
                livereload: 35729,
                spawn: false // dont create a new process if one is already running
            }
        },
        concat: {
            js_client: {
                src: [
                    'bower_components/angular/angular.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.js',
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'src/client/js/main.js',
                    'src/client/js/controllers.js',
                    'src/client/js/services.js',
                    'src/client/js/directives.js'
                ],
                dest: 'tmp/client.concat.js'
            },
            css: {
                src: ['bower_components/**/*.css', 'src/**/*.css'],
                dest: 'tmp/client.concat.css'
            }
        },
        uglify: {
            prod: {
                files: {'tmp/client.min.js': ['tmp/client.concat.js']}
            }
        },
        cssmin: {
            prod: {
                files: {'tmp/client.min.css': ['tmp/client.concat.css']}
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
  
    grunt.registerTask('dev', [
        'clean:tmp',
        'jade:dev',
        'jshint', 
        'concat:js_client',
        'concat:css',
        'clean:www_dev',
        'copy:www_dev',
        'watch'
    ]);

    grunt.registerTask('prod', [
        'clean:tmp',
        'jade:prod',
        'jshint',
        'concat:js_client',
        'concat:css',
        'uglify:prod',
        'cssmin:prod',
        'clean:www_prod',
        'copy:www_prod'
    ]);

};
