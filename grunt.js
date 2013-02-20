module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      files: [
        'grunt.js',
        'perfect.js',
        'examples/**/src/*.js'
      ],
      tasks: 'default'
    },

    lint: {
      all: [
        'grunt.js',
        'perfect.js',
        'examples/**/src/*.js'
      ]
    },

    jshint: {
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
        "es5"      : true
      }
    },

    min: {
      perfectjs: {
        src: ['perfect.js'],
        dest: 'perfect.min.js'
      }
    }
  });

  grunt.registerTask('default', 'lint min');
};