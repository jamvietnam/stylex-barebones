module.exports = function(grunt) {
  "use strict";

  var theme_name  = 'lightningdemo';      // prefix the theme name
  var assets_dir   = 'assets';                   // locate the sass, js, images etc
  var dist_dir    = 'dist';            // export path for rendered files

  var global_vars = {
    theme_name: theme_name,
    assets_dir: assets_dir,
    dist_dir: dist_dir,
    theme_css: 'css',
    theme_scss: 'scss'
  }

  grunt.initConfig({
    global_vars: global_vars,
    pkg: grunt.file.readJSON('package.json'),

    sass: {                               // Task
      dist: {                             // Target
        options: {                        // Target options
          loadPath: ['<%= global_vars.assets_dir %>/<%= global_vars.theme_scss %>', require('node-bourbon').includePaths],
          sourcemap: 'file',
          style: 'expanded'
        },
        files: {                          // Dictionary of files
          '<%= global_vars.dist_dir %>/<%= global_vars.theme_css %>/<%= global_vars.theme_name %>.css': '<%= global_vars.assets_dir %>/<%= global_vars.theme_scss %>/<%= global_vars.theme_name %>.scss'
        }
      }
    },
    imagemin: {                          // Task
      static: {                          // Target
        options: {                       // Target options
          optimizationLevel: 3,
          svgoPlugins: [{ removeViewBox: false }]
          //use: [mozjpeg()]
        },
        files: {                         // Dictionary of files
          '<%= global_vars.dist_dir %>/images/**/*.png': '<%= global_vars.assets_dir %>/images/**/*.png', // 'destination': 'source'
          '<%= global_vars.dist_dir %>/images/**/*.jpg': '<%= global_vars.assets_dir %>/images/**/*.jpg',
          '<%= global_vars.dist_dir %>/images/**/*.gif': '<%= global_vars.assets_dir %>/images/**/*.gif'
        }
      },
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: '<%= global_vars.assets_dir %>/images/', // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: '<%= global_vars.dist_dir %>/images/' // Destination path prefix
        }]
      }
    },
    copy: {
      dist: {
        files: [
          {expand:true, cwd: 'bower_components/foundation/js', src: ['foundation/*.js'], dest: 'js/', filter: 'isFile'},
          {expand:true, cwd: 'bower_components/foundation/', src: ['foundation.min.js'], dest: 'js/', filter: 'isFile'},
          {expand:true, cwd: 'bower_components/foundation/js/vendor', src: ['fastclick.js'], dest: 'js/vendor', filter: 'isFile'},
          {expand:true, cwd: 'bower_components/foundation/js/vendor', src: ['jquery.cookie.js'], dest: 'js/vendor', filter: 'isFile'},
          {expand:true, cwd: 'bower_components/foundation/js/vendor', src: ['modernizr.js'], dest: 'js/vendor', filter: 'isFile'},
          {expand:true, cwd: 'bower_components/foundation/scss/foundation/components', src: '**/*.scss', dest: 'scss/vendor/foundation/components', filter: 'isFile'},
          {expand:true, cwd: 'bower_components/foundation/scss/foundation', src: '_functions.scss', dest: 'scss/vendor/foundation', filter: 'isFile'},
        ]
      }
    },

    watch: {
      grunt: {
        files: [
          'Gruntfile.js',
          'templates/**/*',
          '<%= global_vars.dist_dir %>/images/**/*.{png,jpg,gif}'
        ]
      },
      tasks: ['sass'],

      sass: {
        files: '<%= global_vars.assets_dir %>/<%= global_vars.theme_scss %>/**/*.scss',
        tasks: ['sass']
      }

    },
    browserSync: {
        dev: {
            bsFiles: {
                src : [
                    '<%= global_vars.dist_dir %>/<%= global_vars.theme_css %>/*.css',
                    'templates/**/*',
                    '<%= global_vars.dist_dir %>/images/**/*'
                ]
            },
            options: {
                watchTask: true,
                proxy: "maggistylex.dev"
            }
        }
    },
    sync: {
      main: {
        files: [
            {src: ['<%= global_vars.dist_dir %>/**'], dest: '../themes/lightningdemo/'}, // includes files in path and its subdirs
            {src: ['<%= global_vars.assets_dir %>/**'], dest: '../themes/lightningdemo/'} // includes files in path and its subdirs
        ],
        verbose: true, // Display log messages when copying files
        failOnError: true // Fail the task when copying is not possible. Default: false
      }
    }

  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-sync');

  grunt.registerTask('build', ['sass', 'imagemin', 'copy']);
  grunt.registerTask('default', ['browserSync', 'build', 'watch', 'sync']);
}
