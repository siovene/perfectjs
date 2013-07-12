module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: [
          'Gruntfile.js',
          'src/*.js',
          'examples/**/src/*.js'
        ],
        tasks: ['default']
      }
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'src/*.js'
      ],
      options: {
        "validthis": true,
        "laxcomma" : true,
        "laxbreak" : true,
        "browser"  : true,
        "eqnull"   : true,
        "debug"    : true,
        "devel"    : true,
        "boss"     : true,
        "expr"     : true,
        "asi"      : true,
        'smarttabs': true,
        'sub'      : true
      }
    },

    concat: {
        perfect: {
            src: ['src/perfect-runner.js', 'src/perfect-core.js'],
            dest: 'dist/perfect.js'
        },

        qunit: {
            src: ['src/perfect-qunit.js'],
            dest: 'dist/perfect-qunit.js'
        },

        ui: {
            src: ['src/perfect-ui.js'],
            dest: 'dist/perfect-ui.js'
        },

        libs: {
            src: [
                'modules/lodash/lodash.js',
                'modules/benchmark.js/benchmark.js',
                'modules/lazyload/lazyload-min.js',
                'modules/Mediator.js/mediator.min.js'
            ],
            dest: 'dist/perfect-libs.js'
        },

        css: {
            src: ['modules/bootstrap/docs/assets/css/bootstrap.css', 'src/perfect-ui.css'],
            dest: 'dist/perfect-ui.css'
        }
    },

    uglify: {
        perfect: {
            src: ['dist/perfect.js'],
            dest: 'dist/perfect.min.js'
        },

        qunit: {
            src: ['dist/perfect-qunit.js'],
            dest: 'dist/perfect-qunit.min.js'
        },

        ui: {
            src: ['dist/perfect-ui.js'],
            dest: 'dist/perfect-ui.min.js'
        },

        libs: {
            src: ['dist/perfect-libs.js'],
            dest: 'dist/perfect-libs.min.js'
        },
    },

    cssmin: {
        minify: {
            expand: true,
            cwd: 'dist',
            src: ['*.css', '!*.min.css'],
            dest: 'dist',
            ext: '.min.css'
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-update-submodules');

  grunt.registerTask('submodules', ['update_submodules']);
  grunt.registerTask('default', [
    'update_submodules',
    'jshint',
    'concat',
    'uglify',
    'cssmin:minify'
  ]);
};
