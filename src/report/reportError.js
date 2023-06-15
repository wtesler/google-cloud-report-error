/**
 * Report the server error to Google Cloud Platform and return an error response.
 */
async function reportError(e, service='default') {
  console.error(e);
  const responseBody = { message: e.message, code: e.code };
  responseBody.code = responseBody.code ? responseBody.code : 500;
  const code = responseBody.code;
  const acceptableErrors = [403, 405, 422];
  if (code > 400 && !acceptableErrors.includes(code)) {
    await report(e, service); // We only report server errors.
  }
  return responseBody;
}

async function report(e, service) {
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

    return new Promise((resolve, reject) => {
      try {
        errorReporting.report(e, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = {
  reportError, report
};
