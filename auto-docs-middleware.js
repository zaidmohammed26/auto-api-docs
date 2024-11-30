const fs = require("fs");
const path = require("path");

function autoDocsMiddleware(req, res, next) {
  try {
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

    // Read existing logs if the file exists
    if (fs.existsSync(logFilePath)) {
      logs = JSON.parse(fs.readFileSync(logFilePath, "utf-8"));
    }

    // Check for duplicates based on `method` and `url`
    const isDuplicate = logs.some(
      (entry) => entry.method === method && entry.url === url
    );

    if (!isDuplicate) {
      logs.push(logEntry); // Append only if it's not a duplicate

      // Write the updated logs back to the file
      fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
    }
  } catch (error) {
    console.error("Error logging request details:", error);
    // Proceed to the next middleware even if logging fails
  }

  next(); // Continue to the next middleware/route handler
}

module.exports = autoDocsMiddleware;
