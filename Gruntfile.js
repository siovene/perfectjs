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

    uglify: {
      perfectjs: {
        src: ['perfect-core.js', 'perfect-runner.js'],
        dest: 'perfect.min.js'
      },
      perfect_qunit: {
        src: ['perfect-qunit.js'],
        dest: 'perfect-qunit.min.js'
      },
      perfect_ui: {
        src: ['perfect-ui.js'],
        dest: 'perfect-ui.min.js'
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'uglify']);
};
