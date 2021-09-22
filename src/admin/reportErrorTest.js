const reportError = require("../report/reportError");

(async() => {
  process.env.NODE_ENV = "production";
  await reportError(new Error("Test Error"));
})();
