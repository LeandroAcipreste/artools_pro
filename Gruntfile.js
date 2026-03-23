module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['dist']
    },

    copy: {
      main: {
        files: [
          // Copia vídeos e svg (já que SVG já pode estar otimizado, se não, usamos svgmin depois)
          { 
            expand: true, 
            src: ['raw_files/**/*.mp4', 'raw_files/**/*.svg', 'video_frames/**/*.svg'], 
            dest: 'dist/' 
          }
        ]
      }
    },

    terser: {
      options: {
        ecma: 2020,
        compress: true,
        mangle: {
          toplevel: true, // garante minificação alta em ES modules isolados
        }
      },
      main: {
        files: [{
          expand: true,
          src: ['firstSite/js/**/*.js', 'firstSite/*.js'],
          dest: 'dist/'
        }]
      }
    },

    cssmin: {
      main: {
        files: [{
          expand: true,
          src: ['firstSite/**/*.css'],
          dest: 'dist/'
        }]
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true, // pode ajudar
        minifyCSS: true
      },
      main: {
        files: [{
          expand: true,
          src: ['firstSite/**/*.html'],
          dest: 'dist/'
        }]
      }
    },

    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 5 // Alto nível de compressão
        },
        files: [{
          expand: true,
          src: ['raw_files/**/*.{png,jpg,jpeg,gif}', 'video_frames/**/*.{png,jpg,jpeg,gif}'],
          dest: 'dist/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-terser');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('default', ['clean', 'copy', 'terser', 'cssmin', 'htmlmin', 'imagemin']);
  grunt.registerTask('build', ['default']);
};
