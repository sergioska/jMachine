module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            client: {
                src: [
                    'src/js/**/*.js',
                    '!src/libs/**/*.js',
                ],
                options: {
                    globals: {
                        jQuery: true,
                        console:true,
                        module: true,
                        strict: false,
                    }
                }
            }
        },
        
        concat: {
            client: {
                options: {
                    separator: '\n'
                },
                files: {
                    'dist/js/jmachine.js': ['src/js/json/**/*.js', 
                                            'src/js/*.js', 
                                            'src/js/angular/*.js', 
                                            '!src/js/angular/ws.js'],
                    'dist/css/jmachine.css': ['src/css/*.css', 
                                              'bower_components/angular-ui-select/dist/select.min.css',
                                              'bower_components/select2/select2.css',
                                              'bower_components/jquery-ui/themes/smoothness/jquery-ui.css']
                }
            }
        },
        
    	copy: {
    		client: {
    			files: [
    				{
    					expand: true,
    				        cwd: 'bower_components/jquery/dist',	
    					src: ['jquery.min.js'], 
    					dest: 'dist/js'
    				},
    				{
    					expand: true,
    					cwd: 'bower_components/angular',
    					src: ['angular.min.js'],
    					dest: 'dist/js'	
    				},
    				{
    					expand: true,
    					cwd: 'bower_components/angular-sanitize',
    					src: ['angular-sanitize.min.js'],
    					dest: 'dist/js'
    				},
    				{
    					expand: true,
    					cwd: 'bower_components/angular-ui-select/dist',
    					src: ['select.min.js'],
    					dest: 'dist/js'
    				},
                    {
                        expand: true,
                        cwd: 'bower_components/angular-ui-slider/src',
                        src: ['slider.js'],
                        dest: 'dist/js'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery-ui',
                        src: ['jquery-ui.min.js'],
                        dest: 'dist/js'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery-ui/themes/smoothness/images',
                        src: ['*.png', '*.gif'],
                        dest: 'dist/css/images'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/select2',
                        src: ['select2.png'],
                        dest: 'dist/css'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/components-font-awesome/fonts',
                        src: ['**'],
                        dest: 'dist/fonts'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/components-font-awesome/css',
                        src: ['font-awesome.min.css'],
                        dest: 'dist/css'
                    }
    			]
    		}
	},
        uglify: {
            client: {
                files: {
                    'dist/js/jmachine.min.js': 'dist/js/jmachine.js'
                }
            }

        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        watch: {
            scripts: {
                files: ['src/js/**/*.js', 'src/css/*.css'],
                tasks: ['client'],
                options: {
                spawn: false,
                },
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('client', ['jshint:client', 'concat:client', 'copy:client', 'uglify:client']);
    grunt.registerTask('test', ['karma']);

}
