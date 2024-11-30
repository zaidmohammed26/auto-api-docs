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
const { exec } = require("child_process");
const chalk = require("chalk");
const path = require("path");

module.exports = async function docs() {
  console.log(chalk.blue("Generating API documentation..."));

  const openapiFile = path.resolve("openapi.yaml");

  const commands = `
  git fetch origin docs-br &&
  git checkout docs-br || git checkout --orphan docs-br &&
  git reset --hard &&
  git clean -fd &&
  `;

  // Execute the git commands to prepare the branch
  exec(commands, (err, stdout, stderr) => {
    if (err) {
      console.error(chalk.red("Failed to switch to docs-br branch:"), stderr);
      return;
    }

    console.log(chalk.green("Switched to docs-br branch!"));
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
        }
      }
    );
  });
};
