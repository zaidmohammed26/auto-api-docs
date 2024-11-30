const chalk = require("chalk");
const { exec } = require("child_process");

module.exports = async function deploy() {
  console.log(chalk.blue("Deploying API documentation..."));

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
  // Push the "docs" folder to the `gh-pages` branch using Git subtree
  exec(commands, (err, stdout, stderr) => {
    if (err) {
      console.error(chalk.red("Deployment failed:"), stderr);
    } else {
      console.log(
        chalk.green("Documentation deployed successfully to GitHub Pages!")
      );
    }
  });
};
