module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: [
          'Gruntfile.js',
          'perfect-core.js',
          'perfect-runner.js',
          'perfect-qunit.js',
          'perfect-ui.js',
          'examples/**/src/*.js'
        ],
        tasks: ['default']
      }
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'perfect-core.js',
        'perfect-runner.js',
        'perfect-qunit.js',
        'perfect-ui.js'
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
        "es5"      : true,
        'smarttabs': true,
        'sub'      : true
      }
    },

    concat: {
        perfect: {
            src: ['perfect-runner.js', 'perfect-core.js'],
            dest: 'dist/perfect.js'
        },

        qunit: {
            src: ['perfect-qunit.js'],
            dest: 'dist/perfect-qunit.js'
        },

        ui: {
            src: ['perfect-ui.js'],
            dest: 'dist/perfect-ui.js'
        },

        libs: {
            src: [
                'lib/benchmark.js',
                'lib/lodash.js',
                'lib/lazyload.js',
                'lib/mediator.js'
            ],
            dest: 'dist/perfect-libs.js'
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
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
