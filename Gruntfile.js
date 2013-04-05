module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: [
          'grunt.js',
          'perfect.js',
          'perfect-qunit.js',
          'examples/**/src/*.js'
        ],
        tasks: ['default']
      }
    },

    jshint: {
      all: [
        'grunt.js',
        'perfect.js',
        'perfect-qunit.js',
        'examples/**/src/*.js'
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
        src: ['perfect.js'],
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
