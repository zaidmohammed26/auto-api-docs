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

  // Create a function to run each command in sequence
  const runCommand = (command, successMessage) => {
    return new Promise((resolve, reject) => {
      console.log(chalk.blue(`Running: ${command}`));
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(chalk.red(`Error: ${stderr}`));
          reject(stderr);
        } else {
          console.log(chalk.green(successMessage || `Success: ${command}`));
          resolve(stdout);
        }
      });
    });
  };

  try {
    // Ensure we are on the main branch
    await runCommand("git checkout main", "Checked out main branch");

    // Create or fetch the gh-pages branch
    await runCommand("git fetch origin gh-pages", "Fetched gh-pages branch");

    // If the gh-pages branch doesn't exist, create it
    await runCommand(
      "git checkout gh-pages || git checkout --orphan gh-pages",
      "Checked out or created gh-pages branch"
    );

    // Reset and clean the working directory
    await runCommand("git reset --hard", "Reset working directory");
    await runCommand("git clean -fd", "Cleaned untracked files");

    // Checkout to the main branch where we generate the documentation
    await runCommand("git checkout main", "Checked out main branch");

    // Split the docs folder and create a temporary branch
    await runCommand(
      "git subtree split --prefix docs -b gh-pages-temp",
      "Created temporary gh-pages branch"
    );

    // Push the docs folder to gh-pages branch
    await runCommand(
      "git push origin gh-pages-temp:gh-pages -f",
      "Pushed documentation to gh-pages"
    );

    // Delete the temporary branch
    await runCommand(
      "git branch -D gh-pages-temp",
      "Deleted temporary gh-pages branch"
    );

    console.log(
      chalk.green("Documentation deployed successfully to GitHub Pages!")
    );
  } catch (error) {
    console.error(chalk.red("Deployment failed!"));
    console.error(error);
  }
};
