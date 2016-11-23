// Karma configuration
// Generated on Mon Nov 21 2016 19:50:46 GMT-0300 (CLST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './public',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
     'bower_components/angular/angular.js',                             // angular
     'bower_components/angular-ui-router/release/angular-ui-router.js', // ui-router
     'bower_components/angular-mocks/angular-mocks.js',                 // loads our modules for tests
     'bower_components/angular-animate/angular-animate.js',                 // loads our modules for tests
     'bower_components/angular-material/angular-material.js',                 // loads our modules for tests
     'bower_components/angular-aria/angular-aria.js',                 // loads our modules for tests
     'bower_components/chart.js/dist/Chart.js',                 // loads our modules for tests
     'bower_components/angular-chart.js/angular-chart.js',                 // loads our modules for tests
     'bower_components/angular-messages/angular-messages.js',                 // loads our modules for tests angular-material-data-table
     'bower_components/angular-cookies/angular-cookies.js',                 // loads our modules for tests angular-material-data-table
     'bower_components/angular-resource/angular-resource.js',                 // loads our modules for tests angular-material-data-table
     'bower_components/angular-material-data-table/dist/md-data-table.js',                 // loads our modules for tests
     'bower_components/angular-material-data-table/dist/md-data-table.js',                 // loads our modules for tests
     'bower_components/satellizer/dist/satellizer.js',                 // loads our modules for tests
     'app.js',                                                  // our angular app
     'login/login.js',
     'logout/logout.js',
     'main/networks/networks.js',
    //  'main/perfil/perfil.js',
     'main/motes/motes.js',
     'main/dashboard/dashboard.js',
     'main/main.js',
     'main/users/users.js',
     'components/services/user.service.js',
     'components/services/user.spec.js',
   ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
