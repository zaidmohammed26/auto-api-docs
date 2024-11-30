const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

module.exports = async function init() {
  console.log(
    chalk.blue("Initializing repository for API documentation automation...")
  );

  const workflowDir = ".github/workflows";
  const workflowFile = path.join(workflowDir, "auto-docs.yml");
  const ciContent = `
name: AutoDocs CI
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm install

      - name: Generate OpenAPI spec
        run: npx auto-docs generate

      - name: Generate documentation
        run: npx auto-docs docs

      - name: Deploy documentation
        run: npx auto-docs deploy
`;

  // Create the GitHub Actions workflow directory and file
  try {
    await fs.ensureDir(workflowDir);
    await fs.writeFile(workflowFile, ciContent);
    console.log(chalk.green(`Workflow file created at ${workflowFile}`));
  } catch (error) {
    console.error(chalk.red("Failed to initialize repository:"), error);
  }
};
