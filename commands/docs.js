// const { exec } = require("child_process");
// const chalk = require("chalk");
// const path = require("path");

// module.exports = async function docs() {
//   console.log(chalk.blue("Generating API documentation..."));

//   const openapiFile = path.resolve("openapi.yaml");
//   const outputDir = path.resolve("docs");

//   // Use an OpenAPI documentation generator (e.g., Redoc CLI)
//   exec(
//     `npx redoc-cli bundle ${openapiFile} -o ${outputDir}/index.html`,
//     (err, stdout, stderr) => {
//       if (err) {
//         console.error(chalk.red("Failed to generate documentation:"), stderr);
//       } else {
//         console.log(chalk.green("Documentation successfully generated!"));
//         console.log(chalk.green(`Find the documentation in ${outputDir}`));
//       }
//     }
//   );
// };
const { exec } = require("child_process");
const chalk = require("chalk");
const path = require("path");

module.exports = async function docs() {
  console.log(chalk.blue("Generating API documentation..."));

  const openapiFile = path.resolve("openapi.yaml");
  const outputDir = path.resolve("docs");

  // Use an OpenAPI documentation generator (e.g., Redoc CLI)
  exec(
    `npx redoc-cli bundle ${openapiFile} -o ${outputDir}/index.html`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(chalk.red("Failed to generate documentation:"), stderr);
      } else {
        console.log(chalk.green("Documentation successfully generated!"));
        console.log(chalk.green(`Find the documentation in ${outputDir}`));

        // Add logic to create a new branch 'docs' and push the docs folder to it
        exec(
          `git checkout --orphan docs && git reset --hard && git clean -fd && git add docs && git commit -m "Deploy generated docs" && git push origin docs --force`,
          (err, stdout, stderr) => {
            if (err) {
              console.error(
                chalk.red("Failed to push docs to docs branch:"),
                stderr
              );
            } else {
              console.log(chalk.green("Docs pushed to 'docs' branch!"));
            }
          }
        );
      }
    }
  );
};
