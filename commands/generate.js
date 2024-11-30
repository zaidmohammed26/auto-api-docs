// const chalk = require("chalk");
// const fs = require("fs");
// const glob = require("glob");
// const yaml = require("js-yaml");

// module.exports = async function generate() {
//   console.log(chalk.blue("Generating OpenAPI specification..."));

//   // Define a basic OpenAPI structure
//   let openapiSpec = {
//     openapi: "3.0.0",
//     info: {
//       title: "API Documentation",
//       version: "1.0.0",
//       description: "Generated API documentation",
//     },
//     paths: {},
//   };

//   // Scan for API route definitions (basic pattern matching as a placeholder)
//   const files = glob.sync("src/**/*.js");
//   files.forEach((file) => {
//     const content = fs.readFileSync(file, "utf-8");

//     if (content.includes("app.get")) {
//       console.log("hi");
//       openapiSpec.paths["/example"] = {
//         get: {
//           summary: "Example endpoint",
//           responses: {
//             200: {
//               description: "Successful response",
//             },
//           },
//         },
//       };
//     }
//   });

//   // Write the OpenAPI spec to a YAML file
//   const outputFile = "openapi.yaml";
//   try {
//     fs.writeFileSync(outputFile, yaml.dump(openapiSpec)); //replaces the content of the file if it already exists
//     console.log(chalk.green(`OpenAPI spec generated at ${outputFile}`));
//   } catch (error) {
//     console.error(chalk.red("Failed to write OpenAPI file:"), error);
//   }
// };
const chalk = require("chalk");
const fs = require("fs");
const glob = require("glob");
const yaml = require("js-yaml");
const { execSync } = require("child_process");

module.exports = async function generate() {
  console.log(chalk.blue("Generating OpenAPI specification..."));

  // Step 1: Ensure we are in the correct branch or create it if necessary
  try {
    console.log(chalk.yellow("Checking out docs-br branch..."));
    execSync("git checkout docs-br || git checkout --orphan docs-br"); // Switch to docs-br or create orphan branch
    console.log(chalk.green("Switched to docs-br branch!"));

    // If it's an orphan branch, ensure it has an initial commit
    const status = execSync("git status --porcelain").toString().trim();
    if (status) {
      execSync("git add -A");
      execSync('git commit -m "Initial commit on docs-br branch"');
    }
  } catch (error) {
    console.error(
      chalk.red("Failed to switch to or create docs-br branch:"),
      error.message
    );
    return;
  }

  // Step 2: Define a basic OpenAPI structure
  let openapiSpec = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Generated API documentation",
    },
    paths: {},
  };

  // Step 3: Scan for API route definitions
  const files = glob.sync("src/**/*.js");
  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");

    if (content.includes("app.get")) {
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

  // Step 4: Write the OpenAPI spec to a YAML file
  const outputFile = "openapi.yaml";
  try {
    fs.writeFileSync(outputFile, yaml.dump(openapiSpec));
    console.log(chalk.green(`OpenAPI spec generated at ${outputFile}`));
  } catch (error) {
    console.error(chalk.red("Failed to write OpenAPI file:"), error);
    return;
  }

  // Step 5: Add the updated file and push to docs-br
  try {
    execSync("git add -f openapi.yaml"); // Add the updated file to the staging area
    execSync('git commit -m "Auto-generated OpenAPI spec" --allow-empty'); // Allow empty commits if no changes
    execSync("git push --force origin docs-br"); // Force-push the updated branch
    console.log(
      chalk.green("Successfully pushed OpenAPI spec to docs-br branch!")
    );
  } catch (error) {
    console.error(
      chalk.red("Failed to push changes to docs-br branch:"),
      error.message
    );
  }
};
