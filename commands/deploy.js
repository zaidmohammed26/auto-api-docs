// const chalk = require("chalk");
// const { exec } = require("child_process");

// module.exports = async function deploy() {
//   console.log(chalk.blue("Deploying API documentation..."));

//   const commands = `
//   git fetch origin gh-pages &&
//   git checkout gh-pages || git checkout --orphan gh-pages &&
//   git reset --hard &&
//   git clean -fd &&
//   git checkout main &&
//   git subtree split --prefix docs -b gh-pages-temp &&
//   git push origin gh-pages-temp:gh-pages -f &&
//   git branch -D gh-pages-temp
// `;

//   // Push the "docs" folder to the `gh-pages` branch using Git subtree
//   exec(commands, (err, stdout, stderr) => {
//     if (err) {
//       console.error(chalk.red("Deployment failed:"), stderr);
//     } else {
//       console.log(
//         chalk.green("Documentation deployed successfully to GitHub Pages!")
//       );
//     }
//   });
// };
// const chalk = require("chalk");
// const { exec } = require("child_process");

// module.exports = async function deploy() {
//   console.log(chalk.blue("Deploying API documentation..."));

//   // Configure Git user for the action
//   exec(
//     `git config user.name "GitHub Actions Bot" && git config user.email "actions@github.com"`,
//     (err, stdout, stderr) => {
//       if (err) {
//         console.error(chalk.red("Git configuration failed:"), stderr);
//         return;
//       }

//       // Create or switch to the 'docs' branch
//       exec(
//         `git fetch origin docs || echo "docs branch does not exist. It will be created." && git checkout -b docs || git checkout docs`,
//         (err, stdout, stderr) => {
//           if (err) {
//             console.error(
//               chalk.red("Failed to switch or create 'docs' branch:"),
//               stderr
//             );
//             return;
//           }

//           // Ensure the docs folder is added and pushed to the 'docs' branch
//           exec(
//             `git add docs && git commit -m "Add docs folder for deployment" || echo "No changes to commit" && git push origin docs --force`,
//             (err, stdout, stderr) => {
//               if (err) {
//                 console.error(chalk.red("Failed to push docs folder:"), stderr);
//                 return;
//               }

//               // Deploy to GitHub Pages using the docs branch
//               exec(
//                 `git subtree split --prefix docs -b gh-pages-temp && git push origin gh-pages-temp:gh-pages -f && git branch -D gh-pages-temp`,
//                 (err, stdout, stderr) => {
//                   if (err) {
//                     console.error(chalk.red("Deployment failed:"), stderr);
//                   } else {
//                     console.log(
//                       chalk.green(
//                         "Documentation deployed successfully to GitHub Pages!"
//                       )
//                     );
//                   }
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// };

console.log("deploy");
