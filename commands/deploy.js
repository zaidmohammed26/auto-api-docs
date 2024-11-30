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
const chalk = require("chalk");
const { exec } = require("child_process");

module.exports = async function deploy() {
  console.log(chalk.blue("Deploying API documentation..."));

  // Create the commands to run
  const commands = [
    // Fetch gh-pages and create if not exists
    "git fetch origin gh-pages || git checkout --orphan gh-pages",
    "git checkout docs-br", // Ensure you are on the main branch
    "git subtree split --prefix docs -b gh-pages-temp", // Create temp branch from docs folder
    "git push origin gh-pages-temp:gh-pages -f", // Force push the temp branch to gh-pages
    "git branch -D gh-pages-temp", // Clean up the temp branch
  ];

  // Function to run a command and log the results
  const runCommand = (command, successMessage) => {
    return new Promise((resolve, reject) => {
      console.log(chalk.blue(`Running: ${command}`));
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(chalk.red(`Error running command: ${command}`), stderr);
          reject(err);
        } else {
          console.log(chalk.green(successMessage || `Success: ${command}`));
          resolve(stdout);
        }
      });
    });
  };

  try {
    // Execute commands sequentially
    for (let command of commands) {
      await runCommand(command, `Successfully ran: ${command}`);
    }
    console.log(
      chalk.green("Documentation successfully deployed to GitHub Pages!")
    );
  } catch (error) {
    console.error(chalk.red("Deployment failed!"), error);
  }
};
