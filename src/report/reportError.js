/**
 * Report the server error to Google Cloud Platform and return an error response.
 */
async function reportError(e, service='default') {
  let errorCode = e.code ? e.code : e.statusCode;
  if (!errorCode) {
    errorCode = 500;
  }

  const responseBody = { message: e.message, code: errorCode };

  const acceptableErrors = [403, 405, 422];
  if (errorCode > 400 && !acceptableErrors.includes(errorCode)) {
    console.error(e);
    await report(e, service); // We only report server errors.
  } else {
    console.warn(e);
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
