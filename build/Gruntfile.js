module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig(
  {
    pkg: grunt.file.readJSON('package.json'),
    compass: {                  // Task
      dist: {                   // Target
        options: {              // Target options
          sassDir: '../src/scss',
          cssDir: '../www/lib',
          imagesDir: '../img',
          imagesPath: '../www/img',
          environment: 'development'
        }
      }
    },
    uglify: {
      options: {
        compress: false,
        beautify: true,
        mangle: false
      },
      dist: {
        files: {
          '../www/lib/script.js': ['../src/js/*.js','../src/js/**/*.js']
        }
      }
    }
  }
  );

  // Load the plugins that provides the tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('build', ['uglify:dist','compass:dist']);

};