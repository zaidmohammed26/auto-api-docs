const chalk = require("chalk");
const { exec } = require("child_process");

module.exports = async function deploy() {
  console.log(chalk.blue("Deploying API documentation..."));

  // Create the commands to run
  const commands = [
    // Fetch gh-pages and create if not exists
    `git fetch origin gh-pages || (git checkout --orphan gh-pages && git add -A && git commit -m "Initial commit on gh-pages branch" --allow-empty)`,
    // "git reset --hard",
    // "git clean -fd",
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
