const chalk = require("chalk");
const fs = require("fs");
const glob = require("glob");
const yaml = require("js-yaml");

module.exports = async function generate() {
  console.log(chalk.blue("Generating OpenAPI specification..."));

  // Define a basic OpenAPI structure
  let openapiSpec = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Generated API documentation",
    },
    paths: {},
  };

  // Scan for API route definitions (basic pattern matching as a placeholder)
  const files = glob.sync("src/**/*.js");
  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");

    if (content.includes("app.get")) {
      console.log("hi");
      openapiSpec.paths["/example"] = {
        get: {
          summary: "Example endpoint",
          responses: {
            200: {
              description: "Successful response",
            },
          },
        },
      };
    }
  });

  // Write the OpenAPI spec to a YAML file
  const outputFile = "openapi.yaml";
  try {
    fs.writeFileSync(outputFile, yaml.dump(openapiSpec)); //replaces the content of the file if it already exists
    console.log(chalk.green(`OpenAPI spec generated at ${outputFile}`));
  } catch (error) {
    console.error(chalk.red("Failed to write OpenAPI file:"), error);
  }
};
