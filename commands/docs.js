const fs = require("fs-extra");
const { exec } = require("child_process");
const chalk = require("chalk");
const path = require("path");

module.exports = async function docs() {
  console.log(chalk.blue("Generating API documentation..."));

  const openapiFile = path.resolve("openapi.yaml");
  const outputDir = path.resolve("docs");
  const indexFile = path.join(outputDir, "index.html");

  // Use an OpenAPI documentation generator (e.g., Redoc CLI) to generate the documentation
  exec(
    `npx redoc-cli bundle ${openapiFile} -o ${indexFile}`,
    async (err, stdout, stderr) => {
      if (err) {
        console.error(chalk.red("Failed to generate documentation:"), stderr);
        return;
      }

      console.log(chalk.green("Documentation successfully generated!"));
      console.log(chalk.green(`Find the documentation in ${outputDir}`));

      // Read the generated index.html into a variable
      try {
        const htmlContent = await fs.readFile(indexFile, "utf8");
        console.log(chalk.green("Index.html content loaded into memory"));

        // Now you can manipulate the htmlContent variable as needed
        // Example: Log the HTML content
        // console.log(htmlContent); // Or you can modify it here

        // Push the docs folder (which contains index.html) to the gh-pages branch
        const commands = `
          git fetch origin gh-pages &&
          git checkout gh-pages || git checkout --orphan gh-pages &&
          git reset --hard &&
          git clean -fd &&
          git checkout main &&
          git subtree split --prefix docs -b gh-pages-temp &&
          git push origin gh-pages-temp:gh-pages -f &&
          git branch -D gh-pages-temp
        `;

        exec(commands, (gitErr, gitStdout, gitStderr) => {
          if (gitErr) {
            console.error(
              chalk.red("Failed to push docs to gh-pages:"),
              gitStderr
            );
          } else {
            console.log(chalk.green("Docs successfully pushed to gh-pages!"));
          }
        });
      } catch (readError) {
        console.error(chalk.red("Failed to read index.html:"), readError);
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
