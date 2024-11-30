const chalk = require("chalk");
const { exec } = require("child_process");

module.exports = async function deploy() {
  console.log(chalk.blue("Deploying API documentation..."));

  const commands = `
  git config user.name "GitHub Actions Bot" &&
  git config user.email "actions@github.com" &&
  git fetch origin gh-pages ||
  git checkout --orphan gh-pages &&
  git reset --hard &&
  git clean -fd &&
  git commit --allow-empty -m "Initialize gh-pages branch" &&
  git push origin gh-pages &&
  git checkout main &&
  git add docs &&
  git commit -m "Add docs folder for deployment" ||
  echo "No changes to commit" &&
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
