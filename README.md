# Automated API Docs CLI Tool(auto-docs)
 A simple CLI tool to automate the generation and deployment of API documentation based on your codebase. This tool automates creation and updation of OpenAPI spec file, corresponding index.html and deployment to GitHub Pages using GitHub Actions.

This tool is published as an NPM package. [Reference to the NPM package](https://www.npmjs.com/package/auto-docs-cli)

Co-Contributor for this project is [Kamran Mohammed](https://github.com/Kamran-Mohammed)

# Features
- Adds auto-docs.yml file in the .github/workflows in the users repository which enables automation.
- Automatically logs API endpoints and methods.
- Generates OpenAPI yaml file using the endpoint information.
- Generates the index.html file using OpenAPI yaml file with Redoc CLI
- Deploys the index.html on GitHub Pages by pushing on gh-pages branch
- The above features have individual commands and are also triggered when user pushes code on main branch.

# User Work-Flow
1. Install the tool using npm
  ```bash
  npm install api-docs-cli -g
  ```
2. Initialise auto-docs in your repo which adds auto-docs.yml file in .github/workflows
  ```bash
  auto-docs init
  ```
3. Integrate the middleware into your express.js app to log API requests
  ```javascript
  const autoDocsMiddleware = require("auto-docs-cli/middleware");
  app.use(autoDocsMiddleware);
  ```
4. Push changes on main branch to trigger github actions workkflow which handles the below three commands OR use the below commands in your project to generate openAPI file, index.html and deploy index.html

   
   ```bash
   auto-docs generate
   auto-docs docs
   auto-docs deploy
   ```
5. Get the deployment link in Deployments section in your github repository.

# To-Do's
1. Enhance Middleware Funcionality
   - extracting response examples,params, authentication in requests
2. OpenAPI Spec Improvements
3. Flexible Deployments
4. config file to take in user preferences
5. Allow user to add openAPI spec file 
  
   
