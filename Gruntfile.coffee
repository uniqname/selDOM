module.exports = (grunt) ->
    # load all grunt tasks and not need to declare them at the end
    require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        
        # basic watch tasks first for development
        watch:
            js:
                files: [
                    '*.js'
                ]
                tasks: 'uglify:dist'
                options:
                    livereload: true

        uglify:
            options:
                compress: true
                preserveComments:'some' # preserve the blocks of comments that start with a /*!
                sourceMap: "dist/<%= pkg.name %>.min.js.map"
                sourceMappingURL: "<%= pkg.name %>.min.js.map"
                sourceMapRoot: "."
                sourceMapPrefix: 1

            dist: 
                src:['dist/<%= pkg.name %>.js']
                dest:'dist/<%= pkg.name %>.min.js'

        # https:#npmjs.org/package/grunt-include-replace
        includereplace:
            options:
                # Global variables available in all files
                globals:
                    version: '<%= pkg.version %>'
                    date: '<%= grunt.template.today("yyyy/mm/dd") %>'
                    selDOMjs: '<%= pkg.name %>.js'
                    selDOMjs_min: '<%= pkg.name %>.min.js'
                
                # Optional variable prefix & suffix, defaults as shown
                prefix: '@@'
                suffix: ''

            default: 
                # Files to perform replacements and includes with
                files: {
                    'dist/':['*.js', '*.html']
                }
                # src: ['*.js', '*.html']
                # dest: 'dist/'

        # clean: {
        #     dist: ['temp']
        # },

        shell: {
            moveToDist: {
                command: [
                    'mv ./temp/<%= pkg.name %>.js ./dist/',
                    'mv ./temp/playground.html ./dist/'
                ].join('&&')
            }
        },

        yuidoc:
            compile:
                name: '<%= pkg.name %>'
                description: '<%= pkg.description %>'
                version: '<%= pkg.version %>'
                url: '<%= pkg.homepage %>'
                options:
                    paths: 'dist/'
                    outdir: 'docs/'

    grunt.registerTask 'default',['includereplace:default', 'uglify:dist', 'yuidoc:compile']