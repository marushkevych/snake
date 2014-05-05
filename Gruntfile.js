
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '',
                    keepalive: false
                }
            }
        },
        jasmine: {
            grid: {
//                src: ['bundle.js'],
                options: {
                    specs: 'spec/spec-bundle.js'
                }
            }
        },
        // minify javascript
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'bundle.js': ['bundle.js']
                }
            }
        },
        // Grunt task for node-browserify
        watchify: {
            options: {
                debug: true
            },
            dev: {
                options: {
                    keepalive: true
                },
                src: './js/controller.js',
                dest: 'bundle.js'
            },
            test: {
                src: './spec/*Spec.js',
                dest: 'spec/spec-bundle.js'
            },
            grid: {
                src: './spec/grid/*Spec.js',
                dest: 'spec/grid/spec-bundle.js'
            },
            dist: {
                src: './js/controller.js',
                dest: 'bundle.js'
            }
            
        },        
    });


    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-watchify');
//    grunt.loadNpmTasks('grunt-contrib-uglify');
//
//    grunt.registerTask('watch', ['watchify:dev']); // watch for changes and build the dev bundle
    grunt.registerTask('server', ['connect:server','watchify:dev']);
//    grunt.registerTask('dist', ['watchify:dist','uglify']);
//    
//    // Default task(s).
//    grunt.registerTask('default', ['test',  'dist']);

    grunt.registerTask('test', ['watchify:grid','jasmine:grid']);
    grunt.registerTask('dist', ['watchify:dist']);
};
