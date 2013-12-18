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
                sourceMap: "<%= pkg.name %>.min.js.map"
                sourceMapIn: '<%= pkg.name %>.js.map'

            src:['<%= pkg.name %>.js']
            dest:'<%= pkg.name %>.min.js'

        # https:#npmjs.org/package/grunt-include-replace
        includereplace:
            options:
                # Global variables available in all files
                globals:
                    version: '<%= pkg.version %>'
                    date: '<%= grunt.template.today("yyyy/mm/dd") %>'
                    selDOMjs: '<%= pkg.name %>.min.js'
                
                # Optional variable prefix & suffix, defaults as shown
                prefix: '@@'
                suffix: ''

            # Files to perform replacements and includes with
            src: ['<%= pkg.name %>.js', '<%= pkg.name %>.min.js', '<%= pkg.name %>.html']

        yuidoc:
            compile:
                name: '<%= pkg.name %>'
                description: '<%= pkg.description %>'
                version: '<%= pkg.version %>'
                url: '<%= pkg.homepage %>'
                options:
                    paths: 'dist/'
                    outdir: 'docs/'

    grunt.registerTask 'default',['clean', 'uglify', 'includereplace', 'yuidoc:compile']