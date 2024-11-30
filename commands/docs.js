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
    async (err, stdout, stderr) => {
      if (err) {
        console.error(chalk.red("Failed to generate documentation:"), stderr);
      } else {
        console.log(chalk.green("Documentation successfully generated!"));
        console.log(chalk.green(`Find the documentation in ${outputDir}`));
        try {
          const htmlContent = await fs.readFile(indexFile, "utf8");
          console.log(htmlContent);
        } catch (readError) {
          console.error(chalk.red("Failed to read index.html:"), readError);
        }
      }
    }
  );
};

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

//         // Add logic to ensure the docs folder exists and is committed before pushing
//         exec(
//           `git add docs && git commit -m "Add generated docs" || echo "No changes to commit"`,
//           (err, stdout, stderr) => {
//             if (err) {
//               console.error(chalk.red("Failed to add docs folder:"), stderr);
//             } else {
//               console.log(chalk.green("Docs folder staged successfully!"));

//               // Create or switch to the 'docs' branch and push the docs folder
//               exec(
//                 `git checkout --orphan docs && git reset --hard && git clean -fd && git push origin docs --force`,
//                 (err, stdout, stderr) => {
//                   if (err) {
//                     console.error(
//                       chalk.red("Failed to push docs to docs branch:"),
//                       stderr
//                     );
//                   } else {
//                     console.log(chalk.green("Docs pushed to 'docs' branch!"));
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     }
//   );
// };
