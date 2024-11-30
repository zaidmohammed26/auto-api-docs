// const fs = require("fs-extra");
// const path = require("path");
// const chalk = require("chalk");

// module.exports = async function init() {
//   console.log(
//     chalk.blue("Initializing repository for API documentation automation...")
//   );

//   const docsDir = path.resolve("docs"); // Define the path for the docs folder
//   const indexFile = path.join(docsDir, "index.html"); // Define the path for the index.html file
//   const workflowDir = ".github/workflows";
//   const workflowFile = path.join(workflowDir, "auto-docs.yml");

//   const ciContent = `
// name: AutoDocs CI
// on:
//   push:
//     branches:
//       - main
// jobs:
//   build:
//     runs-on: ubuntu-latest
//     permissions:
//       contents: write
//       issues: read

//     steps:
//       - name: Checkout code
//         uses: actions/checkout@v2

//       - name: Setup Node.js
//         uses: actions/setup-node@v3
//         with:
//           node-version: "16"

//       - name: Install dependencies
//         run: npm install

//       - name: Install auto-docs globally from GitHub repository
//         run: sudo npm install -g git+https://github.com/zaidmohammed26/auto-api-docs.git

//       - name: Generate OpenAPI spec
//         run: auto-docs generate

//       - name: Generate documentation
//         run: auto-docs docs

//       - name: Deploy documentation
//         env:
//           GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
//         run: auto-docs deploy
// `;

//   try {
//     // Create the docs folder if it doesn't exist
//     await fs.ensureDir(docsDir);
//     console.log(chalk.green("Docs folder created successfully"));

//     // Create an empty index.html file in the docs folder
//     await fs.writeFile(indexFile, "", "utf8"); // Create an empty index.html
//     console.log(chalk.green("index.html file created successfully"));

//     // Create the GitHub Actions workflow directory and file
//     await fs.ensureDir(workflowDir);
//     await fs.writeFile(workflowFile, ciContent);
//     console.log(chalk.green(`Workflow file created at ${workflowFile}`));
//   } catch (error) {
//     console.error(chalk.red("Failed to initialize repository:"), error);
//   }
// };
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
    permissions:
      contents: write
      issues: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "16"

      - name: Install dependencies
        run: npm install

      - name: Install auto-docs globally from GitHub repository
        run: npm install -g git+https://github.com/zaidmohammed26/auto-api-docs.git

      - name: Generate OpenAPI spec
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          auto-docs generate
          git add .
          git commit -a -m "generate"

      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          branch: \${{ github.docs-br }}

      - name: Generate documentation
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          auto-docs docs
      #     git add .
      #     git commit -a -m "docs"

      # - name: Push changes
      #   uses: ad-m/github-push-action@master
      #   with:
      #     github_token: \${{ secrets.GITHUB_TOKEN }}
      #     branch: \${{ github.docs-br }}

      - name: Deploy documentation
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          auto-docs deploy
      #     git add .
      #     git commit -a -m "deploy"

      # - name: Push changes
      #   uses: ad-m/github-push-action@master
      #   with:
      #     github_token: \${{ secrets.GITHUB_TOKEN }}
      #     branch: \${{ github.gh-pages }}


`;

  // Create the GitHub Actions workflow directory and file
  try {
    ciContent.replace(/\\\$/g, "$");
    await fs.ensureDir(workflowDir);
    await fs.writeFile(workflowFile, ciContent);
    console.log(chalk.green(`Workflow file created at ${workflowFile}`));
  } catch (error) {
    console.error(chalk.red("Failed to initialize repository:"), error);
  }
};
