module.exports = function (config) {
  config.set({
    // Base path for resolving files
    basePath: '',

    // Frameworks to use (Jasmine in this case)
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // Plugins to load
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    // Files to include in the test
    files: [
      'src/test.ts',   // The test entry point
      'src/**/*.spec.ts' // Include all .spec.ts files
    ],

    // Exclude specific files
    exclude: [
      // Add files you want to exclude from tests here
    ],

    // Preprocessors to use
    preprocessors: {
      'src/**/*.ts': ['coverage']  // Collect code coverage
    },

    // Coverage reporter configuration
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/my-angular-app'),
      subdir: '.',
      reporters: [
        { type: 'html' },   // Generate an HTML report
        { type: 'text-summary' } // Summary in the terminal
      ]
    },

    // Reporters to use (progress for terminal output, kjhtml for browser)
    reporters: ['progress', 'kjhtml'],

    // Web server port
    port: 9876,

    // Enable/disable colors in the output
    colors: true,

    // Log level
    logLevel: config.LOG_INFO,

    // Watch for file changes and rerun tests
    autoWatch: true,

    // Start browsers (Chrome in this case)
    browsers: ['Chrome'],

    // Set this to true to run tests once, then exit
    singleRun: false,

    // Restart on file changes
    restartOnFileChange: true,

    // Client configuration for Jasmine
    client: {
      jasmine: {
        random: false,  // Disable random execution of tests
        seed: 1234      // Set seed for randomization (for reproducibility)
      },
    },

    // Optional: Jasmine HTML reporter configuration
    jasmineHtmlReporter: {
      suppressAll: true // Remove duplicated traces
    }
  });
};
