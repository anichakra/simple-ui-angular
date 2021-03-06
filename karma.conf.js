// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
  
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
  'jasmine'
],
plugins : [
  'karma-chrome-launcher',
  'karma-jasmine'],
   
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'dots']
              : ['progress', 'kjhtml', 'dots'],  
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    browserNoActivityTimeout: 60000

  });
  
};
