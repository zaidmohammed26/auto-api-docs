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
