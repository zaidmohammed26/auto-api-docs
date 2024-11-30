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
  const outputDir = path.resolve("docs");

  // First, try to fetch the branch, then check if it exists
  exec("git fetch origin", (fetchErr, fetchStdout, fetchStderr) => {
    if (fetchErr) {
      console.error(chalk.red("Failed to fetch from origin:"), fetchStderr);
      return;
    }

    exec(
      "git show-ref refs/remotes/origin/docs-br",
      (checkErr, checkStdout, checkStderr) => {
        if (checkErr) {
          console.log(
            chalk.yellow(
              "docs-br branch doesn't exist remotely. Creating it..."
            )
          );

          // If the branch doesn't exist, create it from main and push it to origin
          exec(
            "git checkout main && git checkout -b docs-br && git push -u origin docs-br",
            (createErr, createStdout, createStderr) => {
              if (createErr) {
                console.error(
                  chalk.red("Failed to create docs-br branch:"),
                  createStderr
                );
                return;
              }

              console.log(chalk.green("Created and pushed docs-br branch!"));
              switchToDocsBranch();
            }
          );
        } else {
          console.log(chalk.green("Found docs-br branch. Switching to it..."));
          switchToDocsBranch();
        }
      }
    );
  });

  // Function to handle switching to docs-br and generating documentation
  function switchToDocsBranch() {
    exec(
      "git checkout docs-br",
      (checkoutErr, checkoutStdout, checkoutStderr) => {
        if (checkoutErr) {
          console.error(
            chalk.red("Failed to checkout docs-br branch:"),
            checkoutStderr
          );
          return;
        }

        console.log(chalk.green("Switched to docs-br branch!"));

        exec(
          "git reset --hard && git clean -fd",
          (resetErr, resetStdout, resetStderr) => {
            if (resetErr) {
              console.error(
                chalk.red("Failed to reset and clean docs-br branch:"),
                resetStderr
              );
              return;
            }

            // Generate the API documentation using Redoc CLI
            exec(
              `npx redoc-cli bundle ${openapiFile} -o ${outputDir}/index.html`,
              (docErr, docStdout, docStderr) => {
                if (docErr) {
                  console.error(
                    chalk.red("Failed to generate documentation:"),
                    docStderr
                  );
                  return;
                }

                console.log(
                  chalk.green("Documentation successfully generated!")
                );
                console.log(
                  chalk.green(`Find the documentation in ${outputDir}`)
                );
              }
            );
          }
        );
      }
    );
  }
};
