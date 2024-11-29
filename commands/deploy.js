const chalk = require("chalk");
const { exec } = require("child_process");

module.exports = async function deploy() {
  console.log(chalk.blue("Deploying API documentation..."));

  // Push the "docs" folder to the `gh-pages` branch using Git subtree
  exec(
    "git subtree push --prefix docs origin gh-pages --force",
    (err, stdout, stderr) => {
      if (err) {
        console.error(chalk.red("Deployment failed:"), stderr);
      } else {
        console.log(
          chalk.green("Documentation deployed successfully to GitHub Pages!")
        );
      }
    }
  );
};
