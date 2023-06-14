/**
 * Report the server error to Google Cloud Platform and return an error response.
 */
function reportError(e, service='default') {
  console.error(e);
  const responseBody = { message: e.message, code: e.code };
  responseBody.code = responseBody.code ? responseBody.code : 500;
  if (responseBody.code === 500) {
    report(e, service); // We only report server errors.
  }
  return responseBody;
}

function report(e, service) {
  if (process.env.NODE_ENV === "development") {
    console.warn("Would have reported error but in development.");
  } else {
    console.log("Reporting error...");

    const { ErrorReporting } = require("@google-cloud/error-reporting");

    const errorReporting = new ErrorReporting({
      serviceContext: {
        service: service
      },
      reportMode: 'always',
      logLevel: 5
    });

    errorReporting.report(e);
  }
}

module.exports = {
  reportError, report
};
