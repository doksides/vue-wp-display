module.exports = function(grunt)
{
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
          files: {
              // destination for transpiled js : source js
              'build/main.js': 'vue/main.js',
              'build/store.js': 'vue/store.js',
              'build/pages/alerts.js': 'vue/pages/alerts.js',
              'build/pages/list.js': 'vue/pages/list.js',
              'build/pages/detail.js': 'vue/pages/detail.js',
              'build/pages/category.js': 'vue/pages/category.js'
          },
          options: {
              transform: [['babelify', { presets: ["@babel/preset-env"] }]],
              browserifyOptions: {
                  debug: true
              }
          }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['browserify']);
  grunt.registerTask('uglify', ['uglify']);
}