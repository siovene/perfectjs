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
        'perfect-qunit.js'
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

    uglify: {
      perfectjs: {
        src: ['perfect-core.js', 'perfect-runner.js'],
        dest: 'perfect.min.js'
      },
      perfect_qunit: {
        src: ['perfect-qunit.js'],
        dest: 'perfect-qunit.min.js'
      }
    },

    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost:3000/tests/index.html'
          ]
        }
      }
    },

    connect: {
      server: {
        options: {
          hostname: '0.0.0.0',
          port: 3000,
          base: '.'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'uglify']);
};
