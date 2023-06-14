const {reportError, report} = require('./report/reportError');

const theModule = {
  reportError: reportError,
  report: report,
}

module.exports = theModule;
