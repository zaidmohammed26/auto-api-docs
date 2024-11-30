// const fs = require("fs-extra");
// const { exec } = require("child_process");
// const chalk = require("chalk");
// const path = require("path");

// module.exports = async function docs() {
//   console.log(chalk.blue("Generating API documentation..."));

//   const openapiFile = path.resolve("openapi.yaml");
//   const outputDir = path.resolve("docs");
//   const indexFile = path.join(outputDir, "index.html");

//   // Use an OpenAPI documentation generator (e.g., Redoc CLI) to generate the documentation
//   exec(
//     `npx redoc-cli bundle ${openapiFile} -o ${indexFile}`,
//     async (err, stdout, stderr) => {
//       if (err) {
//         console.error(chalk.red("Failed to generate documentation:"), stderr);
//         return;
//       }

//       console.log(chalk.green("Documentation successfully generated!"));
//       console.log(chalk.green(`Find the documentation in ${outputDir}`));

//       // Read the generated index.html into a variable
//       try {
//         const htmlContent = await fs.readFile(indexFile, "utf8");
//         console.log(chalk.green("Index.html content loaded into memory"));

//         // Write the HTML content to the index.html file in the gh-pages branch
//         const commands = `
//           git fetch origin gh-pages &&
//           git checkout gh-pages || git checkout --orphan gh-pages &&
//           echo "${htmlContent}" > index.html &&
//           git add index.html &&
//           git commit -m "Update index.html with generated API documentation" &&
//           git push origin gh-pages -f
//         `;

//         // Use fs.writeFile to directly write the content to the file
//         await fs.writeFile(path.resolve("index.html"), htmlContent, "utf8");

//         // Now, commit the changes to the gh-pages branch
//         exec(
//           "git fetch origin gh-pages",
//           (gitFetchErr, gitFetchStdout, gitFetchStderr) => {
//             if (gitFetchErr) {
//               console.error(
//                 chalk.red("Failed to fetch gh-pages:"),
//                 gitFetchStderr
//               );
//               return;
//             }

//             // Step 3: Checkout to the gh-pages branch or create a new orphan branch
//             exec(
//               "git checkout gh-pages || git checkout --orphan gh-pages",
//               (gitCheckoutErr, gitCheckoutStdout, gitCheckoutStderr) => {
//                 if (gitCheckoutErr) {
//                   console.error(
//                     chalk.red("Failed to checkout gh-pages:"),
//                     gitCheckoutStderr
//                   );
//                   return;
//                 }

//                 // Step 4: Add the index.html file to staging
//                 exec(
//                   "git add index.html",
//                   (gitAddErr, gitAddStdout, gitAddStderr) => {
//                     if (gitAddErr) {
//                       console.error(
//                         chalk.red("Failed to add index.html:"),
//                         gitAddStderr
//                       );
//                       return;
//                     }

//                     // Step 5: Commit the updated index.html file
//                     // exec(
//                     //   'git commit -m "Update index.html with generated API documentation"',
//                     //   (gitCommitErr, gitCommitStdout, gitCommitStderr) => {
//                     //     if (gitCommitErr) {
//                     //       console.error(
//                     //         chalk.red("Failed to commit changes:"),
//                     //         gitCommitStderr
//                     //       );
//                     //       return;
//                     //     }

//                     // Step 6: Push the changes to gh-pages
//                     exec(
//                       "git push origin gh-pages -f",
//                       (gitPushErr, gitPushStdout, gitPushStderr) => {
//                         if (gitPushErr) {
//                           console.error(
//                             chalk.red("Failed to push docs to gh-pages:"),
//                             gitPushStderr
//                           );
//                         } else {
//                           console.log(
//                             chalk.green("Docs successfully pushed to gh-pages!")
//                           );
//                         }
//                       }
//                     );
//                   }
//                 );
//               }
//             );
//           }
//         );
//         //   }
//         // );
//       } catch (readError) {
//         console.error(chalk.red("Failed to read index.html:"), readError);
//       }
//     }
//   );
// };
const { execSync } = require("child_process");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

module.exports = async function docs() {
  console.log(chalk.blue("Generating API documentation..."));

  const openapiFile = path.resolve("openapi.yaml");
  const outputDir = path.resolve("docs");

  try {
    // Step 1: Switch to docs-br branch or create an orphan branch
    try {
      console.log(chalk.yellow("Checking out docs-br branch..."));
      // execSync("git fetch origin docs-br"); // Fetch remote branch
      execSync("git checkout docs-br || git checkout --orphan docs-br"); // Switch to docs-br or create orphan branch
      console.log(chalk.green("Switched to docs-br branch!"));
    } catch (error) {
      console.error(
        chalk.red("Failed to switch to or create docs-br branch:"),
        error.message
      );
      return;
    }

    // Step 2: Generate documentation using Redoc CLI
    if (!fs.existsSync(openapiFile)) {
      console.error(chalk.red(`OpenAPI spec file (${openapiFile}) not found.`));
      return;
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    execSync(`npx redoc-cli bundle ${openapiFile} -o ${outputDir}/index.html`);
    console.log(chalk.green("Documentation successfully generated!"));

    // Step 3: Push the changes to the docs-br branch
    const status = execSync("git status --porcelain").toString().trim();
    if (status) {
      execSync("git add -f docs/index.html");
      execSync(`git commit -m "Auto-generated OpenAPI spec" --allow-empty`);
      execSync("git push --force origin docs-br");
      console.log(chalk.green("Successfully pushed docs to docs-br branch!"));
    } else {
      console.log(chalk.green("No changes to commit. Working tree clean."));
    }
  } catch (error) {
    console.error(chalk.red("An error occurred:"), error.message);
  }
};
