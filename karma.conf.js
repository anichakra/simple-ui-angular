// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-junit-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
    preprocessors: {
      './src/test.ts': ['@angular/cli']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    browsers: ['Chrome', 'ChromeHeadless', 'ChromeHeadlessNoSandbox'],
customLaunchers: {
  ChromeHeadlessCustom: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
},
frameworks: [
  'jasmine',
],
plugins : [
  'karma-chrome-launcher',
  'karma-jasmine',
],
   
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'coverage-istanbul', 'dots', 'junit']
              : ['progress', 'kjhtml', 'dots', 'junit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    junitReporter: {
      outputFile: 'test-results.xml'
    },
    singleRun: false
  });
  
};
