const fs = require("fs");
const path = require("path");

function autoDocsMiddleware(req, res, next) {
  const method = req.method; // HTTP method (GET, POST, etc.)
  const url = req.originalUrl; // Full URL of the route
  const headers = req.headers; // Request headers
  const timestamp = new Date().toISOString();

  // Log request details to a file
  const logFilePath = path.join(process.cwd(), "auto-docs-log.json");
  const logEntry = {
    method,
    url,
    headers,
    timestamp,
  };

  let logs = [];
  if (fs.existsSync(logFilePath)) {
    logs = JSON.parse(fs.readFileSync(logFilePath, "utf-8"));
  }
  logs.push(logEntry);

  // Save logs
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));

  next(); // Continue to the next middleware/route handler
}

module.exports = autoDocsMiddleware;
