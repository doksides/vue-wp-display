module.exports = function(grunt)
{
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
          files: {
              // destination for transpiled js : source js
              'build/main.js': 'vue/main.js',
          },
          options: {
              transform: [['babelify', { presets: ["@babel/preset-env"] }]],
              browserifyOptions: {
                  debug: true
              }
          }
      }
    },
    watch: {
      scripts: {
        files: ['vue/*.js','vue/**/*.js'],
        tasks: ['browserify'],
        options: {
          debounceDelay: 250,
        },

      }
    },
    uglify: {
      options: {
        banner: "/*! main.min.js file */\n",
        mangle: false
      },
      build: {
        src : ["build/main.js"],
		    dest : "build/main.min.js"
      }
    }
  });

  // Load the plugin
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

}