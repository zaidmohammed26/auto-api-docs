const chalk = require("chalk");
const fs = require("fs");
const glob = require("glob");
const yaml = require("js-yaml");
const { execSync } = require("child_process");

module.exports = async function generate() {
  console.log(chalk.blue("Generating OpenAPI specification..."));

  // Step 1: Ensure we are in the correct branch or create it if necessary
  try {
    const currentBranch = execSync("git branch --show-current")
      .toString()
      .trim();
    if (currentBranch !== "docs-br") {
      try {
        execSync("git checkout docs-br");
        console.log(chalk.green("Switching to existing docs-br branch..."));
      } catch {
        console.log(
          chalk.yellow("docs-br branch doesn't exist. Creating it...")
        );
        execSync("git checkout -b docs-br");
        execSync("git add -A");
        execSync(
          'git commit -m "Initial commit on docs-br branch" --allow-empty'
        );
      }
    }
  } catch (error) {
    console.error(
      chalk.red("Git operation failed. Ensure you are in a git repository."),
      error
    );
    return;
  }

  // Step 2: Define the base OpenAPI structure
  let openapiSpec = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Generated API documentation",
    },
    paths: {},
  };

  // Step 3: Parse the auto-docs-log.json file
  try {
    const logData = JSON.parse(
      fs.readFileSync("src/auto-docs-log.json", "utf-8")
    );
    logData.forEach((entry) => {
      const { method, url, headers, query, body, params, timestamp } = entry;

      if (!openapiSpec.paths[url]) {
        openapiSpec.paths[url] = {}; // Initialize the path object
      }

      openapiSpec.paths[url][method.toLowerCase()] = {
        tags: ["Default"],
        summary: `Handle ${method} request for ${url}`,
        operationId: `${method}${url.replace(/[^\w]/g, "")}`,
        parameters: [],
        requestBody: {
          description: `Request body for ${method} ${url}`,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  ...body, // Include the body properties dynamically
                },
              },
            },
          },
          required: method === "POST", // Require body only for POST requests
        },
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input",
          },
          404: {
            description: "Not Found",
          },
        },
        headers: headers, // Include headers from the log
        queryParams: query, // Include query params from the log
        params: params, // Include params from the log
        timestamp: timestamp, // Timestamp of the request
        deprecated: false,
        security: [],
      };
    });
  } catch (error) {
    console.error(
      chalk.red("Failed to read or parse auto-docs-log.json:"),
      error
    );
    return;
  }

  // Step 4: Write the OpenAPI spec to a YAML file
  const outputFile = "openapi.yaml";
  try {
    fs.writeFileSync(outputFile, yaml.dump(openapiSpec));
    console.log(chalk.green(`OpenAPI spec generated at ${outputFile}`));
  } catch (error) {
    console.error(chalk.red("Failed to write OpenAPI file:"), error);
    return;
  }

  // Step 5: Add the updated file and force-push to docs-br
  try {
    execSync("git add -f openapi.yaml");
    execSync(`git commit -a -m "generate"`);
    execSync("git push --force origin docs-br");
    console.log(
      chalk.green("Successfully pushed OpenAPI spec to docs-br branch!")
    );
  } catch (error) {
    console.error(
      chalk.red("Failed to push changes to docs-br branch:"),
      error
    );
  }
};
